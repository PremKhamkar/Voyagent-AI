import os
from dotenv import load_dotenv
from google import genai

from pathlib import Path

env_path = Path(__file__).resolve().parent / ".env"

print("Loading .env from:", env_path)

load_dotenv(dotenv_path=env_path, override=True)
print("Loading .env from:", env_path)

load_dotenv(dotenv_path=env_path, override=True)

print("API KEY:", os.getenv("GEMINI_API_KEY"))

api_key = os.getenv("GEMINI_API_KEY")

print("API KEY:", os.getenv("GEMINI_API_KEY"))

client = genai.Client(api_key=api_key)

try:
    response = client.models.generate_content(
    model="gemini-flash-latest",
    contents=prompt,
)

    print("SUCCESS!")
    print(response.text)

except Exception as e:
    print("ERROR:", e)