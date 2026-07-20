import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

key = os.getenv("GEMINI_API_KEY")

print("Key loaded:", key is not None)
print("Length:", len(key))
print("Prefix:", key[:8])

client = genai.Client(api_key=key)

try:
    models = client.models.list()

    print("Connected successfully!")

    for model in models:
        print(model.name)

except Exception as e:
    print(type(e).__name__)
    print(e)