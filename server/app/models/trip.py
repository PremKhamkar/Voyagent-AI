from pydantic import BaseModel

class TripRequest(BaseModel):
    destination: str
    startDate: str
    endDate: str
    budget: int
    travelers: int
    travelType: str
    preferences: list[str]