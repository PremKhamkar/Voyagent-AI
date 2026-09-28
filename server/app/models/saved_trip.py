from datetime import datetime

from pydantic import BaseModel


class SavedTripCreate(BaseModel):
    """
    Shape of the trip data the frontend already builds in
    Planner.jsx's handleSaveTrip — field names are camelCase to match
    what the client sends without needing any renaming on that side.
    """

    sourceCity: str
    destination: str
    startDate: str
    endDate: str
    budget: float
    travelers: int
    travelType: str
    preferences: list[str] = []

    itinerary: str = ""
    budgetPlan: str = ""
    destinationPlan: str = ""
    accommodationPlan: str = ""
    weatherInfo: dict = {}


class SavedTripOut(BaseModel):
    id: int
    sourceCity: str
    destination: str
    startDate: str
    endDate: str
    budget: float
    travelers: int
    travelType: str
    preferences: list[str]

    itinerary: str
    budgetPlan: str
    destinationPlan: str
    accommodationPlan: str
    weatherInfo: dict

    savedAt: datetime
