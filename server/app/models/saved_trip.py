from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel


class SaveTripRequest(BaseModel):

    sourceCity: Optional[str] = None
    destination: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    budget: Optional[int] = None
    travelers: Optional[int] = None
    travelType: Optional[str] = None
    preferences: list[str] = []

    itinerary: str = ""
    weatherInfo: Optional[dict[str, Any]] = None
    budgetPlan: str = ""
    destinationPlan: str = ""
    accommodationPlan: str = ""


class SavedTripResponse(BaseModel):

    id: int
    savedAt: datetime

    sourceCity: Optional[str] = None
    destination: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    budget: Optional[int] = None
    travelers: Optional[int] = None
    travelType: Optional[str] = None
    preferences: list[str] = []

    itinerary: str = ""
    weatherInfo: Optional[dict[str, Any]] = None
    budgetPlan: str = ""
    destinationPlan: str = ""
    accommodationPlan: str = ""