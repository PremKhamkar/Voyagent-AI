import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_ai_response(prompt: str):

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="openai/gpt-oss-120b",
        temperature=0.7,
        max_completion_tokens=12000,
        
    )


    return chat_completion.choices[0].message.content

