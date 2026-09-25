from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models.trip import TripRequest
from app.graph.travel_graph import travel_graph

from app.models.trip import TripRequest
from app.graph.travel_graph import travel_graph

from app.services.chatbot_service import (
    generate_chatbot_response
)

from app.services.location_service import (
    get_countries,
    get_children,
    search_locations,
)

from app.services.weather_service import (
    get_weather,
)

from app.services.places_service import (
    get_attractions_for_destination
)

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
    "source_city": trip.sourceCity,
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
    "itinerary": "",
    "weather_info": ""
})

       return {
    "status": "success",
    "message": "AI itinerary generated successfully!",
    "trip": trip,
    "weather_info": result.get("weather_info", ""),
    "budget_plan": result.get("budget_plan", ""),
    "destination_plan": result.get("destination_plan", ""),
    "accommodation_plan": result.get("accommodation_plan", ""),
    "itinerary": result.get("itinerary", "")
}
    except Exception as e:
        print("ERROR:", e)

        raise HTTPException(
    status_code=503,
    detail=(
        f"AI travel planning service is temporarily unavailable. {str(e)}"
    ),
)


@app.get("/attractions")
def get_destination_attractions(destination: str):
    try:
        attractions = get_attractions_for_destination(
            destination
        )

        return {
            "status": "success",
            "destination": destination,
            "attractions": attractions,
        }

    except Exception as error:
        print(
            "ATTRACTIONS ERROR:",
            error,
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "Unable to load tourist attractions "
                "right now."
            ),
        )