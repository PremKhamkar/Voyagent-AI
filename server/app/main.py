from app.services.gemini_service import generate_itinerary
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.models.trip import TripRequest

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to Voyagent AI Backend 🚀"
    }


@app.post("/generate-trip")
def generate_trip(trip: TripRequest):

    prompt = f"""
    Create a detailed travel itinerary.

    Destination: {trip.destination}
    Start Date: {trip.startDate}
    End Date: {trip.endDate}
    Budget: ₹{trip.budget}
    Travelers: {trip.travelers}
    Travel Type: {trip.travelType}
    Preferences: {", ".join(trip.preferences)}

    Give a day-wise travel itinerary.
    """

    ai_response = generate_itinerary(prompt)

    return {
        "status": "success",
        "message": "AI itinerary generated successfully!",
        "trip": trip,
        "itinerary": ai_response
    }