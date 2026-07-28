from typing import TypedDict, List


class TravelState(TypedDict):

    destination: str
    start_date: str
    end_date: str
    budget: float
    travelers: int
    travel_type: str
    preferences: List[str]
    budget_plan: str
    itinerary: str
    destination_plan: str
    accommodation_plan: str
    weather_info: str