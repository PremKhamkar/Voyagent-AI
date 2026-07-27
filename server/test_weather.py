from app.services.weather_service import get_weather


try:
    weather = get_weather("Pune")

    print("Weather API Working!")
    print(weather)

except Exception as e:
    print("Weather API Error:")
    print(e)