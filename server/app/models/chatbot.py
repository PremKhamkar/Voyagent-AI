from typing import Any

from pydantic import BaseModel, Field

# Upper bound on a single chat message, to stop an obviously excessive
# request from consuming AI context/quota. The frontend uses the same
# number for the input box.
MAX_MESSAGE_LENGTH = 1000


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=MAX_MESSAGE_LENGTH)
    trip: dict[str, Any]
    itinerary: str = ""
    weather_info: str = ""
    budget_plan: str = ""
    destination_plan: str = ""
    accommodation_plan: str = ""
