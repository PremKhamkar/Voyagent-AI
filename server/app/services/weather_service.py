import os
import requests
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


def get_weather(destination: str):

    if not OPENWEATHER_API_KEY:
        raise ValueError("OPENWEATHER_API_KEY is not configured.")

    url = "https://api.openweathermap.org/data/2.5/weather"

    params = {
        "q": destination,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        return {
            "city": data["name"],
            "country": data["sys"]["country"],
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "weather": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"]
        }

    except requests.exceptions.HTTPError:

        return {
            "city": destination,
            "country": "Unknown",
            "temperature": "N/A",
            "feels_like": "N/A",
            "weather": "Weather data unavailable",
            "humidity": "N/A",
            "wind_speed": "N/A"
        }

    except Exception as e:

        print(f"Weather Error: {e}")

        return {
            "city": destination,
            "country": "Unknown",
            "temperature": "N/A",
            "feels_like": "N/A",
            "weather": "Weather data unavailable",
            "humidity": "N/A",
            "wind_speed": "N/A"
        }