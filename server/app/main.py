from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models.trip import TripRequest
from app.graph.travel_graph import travel_graph


app = FastAPI()


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Home Route
@app.get("/")
def home():
    return {
        "message": "Welcome to Voyagent AI Backend 🚀"
    }


# Generate Trip Route
@app.post("/generate-trip")
def generate_trip(trip: TripRequest):

    try:
        result = travel_graph.invoke({
            "destination": trip.destination,
            "start_date": str(trip.startDate),
            "end_date": str(trip.endDate),
            "budget": trip.budget,
            "travelers": trip.travelers,
            "travel_type": trip.travelType,
            "preferences": trip.preferences,
            "destination_plan": "",
            "budget_plan": "",
            "accommodation_plan": "",
            "itinerary": ""
        })

        return {
            "status": "success",
            "message": "AI itinerary generated successfully!",
            "trip": trip,
            "itinerary": result["itinerary"]
        }

    except Exception as e:
        print("ERROR:", e)

        raise HTTPException(
            status_code=503,
            detail=f"AI travel planning service is temporarily unavailable. {str(e)}"
        )