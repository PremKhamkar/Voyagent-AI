from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models.trip import TripRequest
from app.services.groq_service import generate_itinerary

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

    try:
        ai_response = generate_itinerary(prompt)

        return {
            "status": "success",
            "message": "AI itinerary generated successfully!",
            "trip": trip,
            "itinerary": ai_response
        }

    except Exception as e:
        print("ERROR:", e)

        raise HTTPException(
            status_code=503,
            detail=f"Gemini is temporarily unavailable. {str(e)}"
        )