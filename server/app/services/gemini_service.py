import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

print("API KEY:", os.getenv("GEMINI_API_KEY"))

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_itinerary(prompt: str):
    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt,
    )
    return response.text