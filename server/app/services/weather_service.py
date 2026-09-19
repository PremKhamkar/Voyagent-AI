import os
import requests
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

CURRENT_WEATHER_URL = (
    "https://api.openweathermap.org/data/2.5/weather"
)

FORECAST_URL = (
    "https://api.openweathermap.org/data/2.5/forecast"
)


def _unavailable_weather(destination: str):
    """
    Safe fallback response when weather data cannot be fetched.
    """

    return {
        "city": destination,
        "country": "Unknown",

        "temperature": "N/A",
        "feels_like": "N/A",

        "weather": "Weather data unavailable",
        "weather_main": "Unavailable",
        "weather_icon": None,

        "humidity": "N/A",
        "wind_speed": "N/A",
        "wind_direction": "N/A",

        "pressure": "N/A",
        "visibility": "N/A",
        "clouds": "N/A",

        "rain_probability": "N/A",

        "sunrise": None,
        "sunset": None,

        "last_updated": None,

        "hourly": [],
        "daily": [],
    }


def _get_weather_icon(icon_code):
    if not icon_code:
        return None

    return (
        f"https://openweathermap.org/img/wn/"
        f"{icon_code}@2x.png"
    )


def _format_timestamp(timestamp):
    if not timestamp:
        return None

    return datetime.fromtimestamp(
        timestamp,
        tz=timezone.utc
    ).isoformat()


def _get_current_weather(destination: str):
    """
    Fetch current weather.
    """

    params = {
        "q": destination.strip(),
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",
    }

    response = requests.get(
        CURRENT_WEATHER_URL,
        params=params,
        timeout=10,
    )

    response.raise_for_status()

    data = response.json()

    weather_data = data.get("weather", [{}])[0]
    main_data = data.get("main", {})
    wind_data = data.get("wind", {})
    sys_data = data.get("sys", {})

    visibility_value = data.get("visibility")

    visibility_km = (
        round(visibility_value / 1000, 1)
        if visibility_value is not None
        else "N/A"
    )

    return {
        "city": data.get(
            "name",
            destination
        ),

        "country": sys_data.get(
            "country",
            "Unknown"
        ),

        "temperature": main_data.get(
            "temp",
            "N/A"
        ),

        "feels_like": main_data.get(
            "feels_like",
            "N/A"
        ),

        "weather": weather_data.get(
            "description",
            "Weather data unavailable"
        ),

        "weather_main": weather_data.get(
            "main",
            "Unavailable"
        ),

        "weather_icon": _get_weather_icon(
            weather_data.get("icon")
        ),

        "humidity": main_data.get(
            "humidity",
            "N/A"
        ),

        "wind_speed": wind_data.get(
            "speed",
            "N/A"
        ),

        "wind_direction": wind_data.get(
            "deg",
            "N/A"
        ),

        "pressure": main_data.get(
            "pressure",
            "N/A"
        ),

        "visibility": visibility_km,

        "clouds": data.get(
            "clouds",
            {}
        ).get(
            "all",
            "N/A"
        ),

        "rain_probability": "N/A",

        "sunrise": sys_data.get(
            "sunrise"
        ),

        "sunset": sys_data.get(
            "sunset"
        ),

        "last_updated": _format_timestamp(
            data.get("dt")
        ),
    }


def _get_forecast(destination: str):
    """
    Fetch OpenWeather 5-day / 3-hour forecast.

    The free forecast endpoint provides forecast
    points every 3 hours. We preserve those points
    as upcoming forecast data rather than inventing
    hourly values.
    """

    params = {
        "q": destination.strip(),
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",
    }

    response = requests.get(
        FORECAST_URL,
        params=params,
        timeout=10,
    )

    response.raise_for_status()

    data = response.json()

    forecast_items = data.get(
        "list",
        []
    )

    hourly = []

    for item in forecast_items:

        weather_data = item.get(
            "weather",
            [{}]
        )[0]

        main_data = item.get(
            "main",
            {}
        )

        wind_data = item.get(
            "wind",
            {}
        )

        hourly.append({
            "time": _format_timestamp(
                item.get("dt")
            ),

            "temperature": main_data.get(
                "temp",
                "N/A"
            ),

            "feels_like": main_data.get(
                "feels_like",
                "N/A"
            ),

            "condition": weather_data.get(
                "description",
                "Unknown"
            ),

            "weather_main": weather_data.get(
                "main",
                "Unknown"
            ),

            "icon": _get_weather_icon(
                weather_data.get("icon")
            ),

            "humidity": main_data.get(
                "humidity",
                "N/A"
            ),

            "wind_speed": wind_data.get(
                "speed",
                "N/A"
            ),

            "rain_probability": round(
                float(item.get("pop", 0)) * 100
            ),

            "clouds": item.get(
                "clouds",
                {}
            ).get(
                "all",
                "N/A"
            ),
        })

    return hourly


def _build_daily_forecast(hourly):
    """
    Build a practical multi-day forecast from the
    available 3-hour forecast points.

    Each day contains:
    - minimum temperature
    - maximum temperature
    - representative condition
    - representative icon
    - maximum rain probability
    - average humidity
    """

    grouped_days = {}

    for item in hourly:

        if not item.get("time"):
            continue

        date_key = item["time"][:10]

        if date_key not in grouped_days:
            grouped_days[date_key] = []

        grouped_days[date_key].append(item)

    daily = []

    for date_key, items in grouped_days.items():

        temperatures = [
            item["temperature"]
            for item in items
            if isinstance(
                item.get("temperature"),
                (int, float)
            )
        ]

        rain_values = [
            item["rain_probability"]
            for item in items
            if isinstance(
                item.get("rain_probability"),
                (int, float)
            )
        ]

        humidity_values = [
            item["humidity"]
            for item in items
            if isinstance(
                item.get("humidity"),
                (int, float)
            )
        ]

        if not items:
            continue

        # Select the forecast point closest to midday
        # as the representative daytime condition.
        representative = min(
            items,
            key=lambda item: abs(
                datetime.fromisoformat(
                    item["time"]
                ).hour - 12
            )
        )

        daily.append({
            "date": date_key,

            "min_temperature": (
                round(min(temperatures), 1)
                if temperatures
                else "N/A"
            ),

            "max_temperature": (
                round(max(temperatures), 1)
                if temperatures
                else "N/A"
            ),

            "condition": representative.get(
                "condition",
                "Unknown"
            ),

            "weather_main": representative.get(
                "weather_main",
                "Unknown"
            ),

            "icon": representative.get(
                "icon"
            ),

            "rain_probability": (
                max(rain_values)
                if rain_values
                else "N/A"
            ),

            "humidity": (
                round(
                    sum(humidity_values)
                    / len(humidity_values)
                )
                if humidity_values
                else "N/A"
            ),
        })

    return daily


def get_weather(destination: str):

    if not OPENWEATHER_API_KEY:
        raise ValueError(
            "OPENWEATHER_API_KEY is not configured."
        )

    if not destination or not destination.strip():
        return _unavailable_weather(
            "Unknown"
        )

    destination = destination.strip()

    try:

        current = _get_current_weather(
            destination
        )

        forecast = _get_forecast(
            destination
        )

        daily = _build_daily_forecast(
            forecast
        )

        return {
            **current,

            # Upcoming 3-hour forecast points.
            "hourly": forecast,

            # Multi-day forecast generated from
            # the same real forecast data.
            "daily": daily,
        }

    except requests.exceptions.HTTPError as error:

        print(
            f"Weather API HTTP Error for "
            f"'{destination}': {error}"
        )

        return _unavailable_weather(
            destination
        )

    except requests.exceptions.RequestException as error:

        print(
            f"Weather API Request Error for "
            f"'{destination}': {error}"
        )

        return _unavailable_weather(
            destination
        )

    except (
        KeyError,
        TypeError,
        ValueError
    ) as error:

        print(
            f"Weather Data Error for "
            f"'{destination}': {error}"
        )

        return _unavailable_weather(
            destination
        )

    except Exception as error:

        print(
            f"Unexpected Weather Error for "
            f"'{destination}': {error}"
        )

        return _unavailable_weather(
            destination
        )