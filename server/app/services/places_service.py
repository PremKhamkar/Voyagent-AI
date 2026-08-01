import os
import requests
from dotenv import load_dotenv

load_dotenv()

GEOAPIFY_API_KEY = os.getenv("GEOAPIFY_API_KEY")


def get_coordinates(destination):

    url = "https://api.geoapify.com/v1/geocode/search"

    params = {
        "text": destination,
        "apiKey": GEOAPIFY_API_KEY
    }

    response = requests.get(url, params=params)
    response.raise_for_status()

    data = response.json()

    if not data["features"]:
        return None

    coordinates = data["features"][0]["geometry"]["coordinates"]

    return coordinates[1], coordinates[0]


def get_attractions(latitude, longitude):

    url = "https://api.geoapify.com/v2/places"

    params = {
        "categories": "tourism.sights",
        "filter": f"circle:{longitude},{latitude},100000",
        "limit": 20,
        "apiKey": GEOAPIFY_API_KEY
    }

    response = requests.get(url, params=params)
    response.raise_for_status()

    data = response.json()

    attractions = set()

    for place in data["features"]:

        name = place["properties"].get("name")

        if name:
            attractions.add(name)

    return sorted(list(attractions))