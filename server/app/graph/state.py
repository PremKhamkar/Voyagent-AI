from typing import TypedDict


class TravelState(TypedDict):
    source_city: str
    destination: str
    start_date: str
    end_date: str
    budget: float
    travelers: int
    travel_type: str
    preferences: list[str]

    budget_plan: str
    itinerary: str
    destination_plan: str
    accommodation_plan: str
    weather_info: str
