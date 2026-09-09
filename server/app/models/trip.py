from pydantic import BaseModel


class TripRequest(BaseModel):

    sourceCity: str

    destination: str

    startDate: str

    endDate: str

    budget: int

    travelers: int

    travelType: str

    preferences: list[str]