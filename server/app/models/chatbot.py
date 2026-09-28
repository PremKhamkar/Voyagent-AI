from typing import Any

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    trip: dict[str, Any]
    itinerary: str = ""
    weather_info: str = ""
    budget_plan: str = ""
    destination_plan: str = ""
    accommodation_plan: str = ""
