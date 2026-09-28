import os
import re
import time

from dotenv import load_dotenv
from groq import Groq, RateLimitError

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

DEFAULT_MODEL = "openai/gpt-oss-120b"

# Groq's free tier limits tokens per minute, separately for each model.
# When a limit is hit it replies with "try again in Ns". Instead of
# failing the whole trip, we wait that long and retry a few times.
MAX_RETRIES = 4
MAX_WAIT_SECONDS = 30


def _retry_delay(error, attempt):
    match = re.search(
        r"try again in (?:(\d+)m)?([\d.]+)s",
        str(error),
    )

    if match:
        minutes = int(match.group(1) or 0)
        seconds = float(match.group(2))

        # +1 second of buffer so the retry lands just after the window.
        return min(minutes * 60 + seconds + 1, MAX_WAIT_SECONDS)

    # No hint in the message: back off 5s, 10s, 20s, ...
    return min(5 * (2**attempt), MAX_WAIT_SECONDS)


def generate_ai_response(
    prompt: str,
    max_completion_tokens: int = 2000,
    model: str = DEFAULT_MODEL,
):

    request_options = {
        "messages": [
            {
                "role": "user",
                "content": prompt,
            }
        ],
        "model": model,
        "temperature": 0.7,
        "max_completion_tokens": max_completion_tokens,
    }

    # Only the gpt-oss models accept this setting. Lower effort means
    # less hidden "thinking", so faster replies that are less likely to
    # be cut off.
    if model.startswith("openai/gpt-oss"):
        request_options["reasoning_effort"] = "low"

    for attempt in range(MAX_RETRIES + 1):
        try:
            chat_completion = client.chat.completions.create(**request_options)

            return chat_completion.choices[0].message.content

        except RateLimitError as error:
            if attempt == MAX_RETRIES:
                raise

            delay = _retry_delay(error, attempt)

            print(
                f"Groq rate limit hit on {model}, retrying in "
                f"{delay:.1f}s (attempt {attempt + 1} of {MAX_RETRIES})"
            )

            time.sleep(delay)
