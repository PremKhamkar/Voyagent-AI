from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models.trip import TripRequest
from app.models.chatbot import ChatRequest

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


app = FastAPI()


# ============================================================
# CORS Configuration
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Home Route
# ============================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to Voyagent AI Backend 🚀"
    }


# ============================================================
# Generate Trip Route
# ============================================================

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
            "weather_info": "",
        })

        return {
            "status": "success",
            "message": "AI itinerary generated successfully!",
            "trip": trip,
            "weather_info": result.get(
                "weather_info",
                ""
            ),
            "budget_plan": result.get(
                "budget_plan",
                ""
            ),
            "destination_plan": result.get(
                "destination_plan",
                ""
            ),
            "accommodation_plan": result.get(
                "accommodation_plan",
                ""
            ),
            "itinerary": result.get(
                "itinerary",
                ""
            ),
        }

    except Exception as e:
        print("ERROR:", e)

        raise HTTPException(
            status_code=503,
            detail=(
                "AI travel planning service is "
                f"temporarily unavailable. {str(e)}"
            ),
        )


# ============================================================
# Live Weather Route
# ============================================================

@app.get("/weather")
def weather(destination: str):

    try:
        if not destination.strip():
            raise HTTPException(
                status_code=400,
                detail="Destination is required.",
            )

        weather_data = get_weather(
            destination.strip()
        )

        return {
            "status": "success",
            "weather": weather_data,
        }

    except HTTPException:
        raise

    except Exception as e:
        print(
            "WEATHER ROUTE ERROR:",
            e
        )

        raise HTTPException(
            status_code=503,
            detail="Unable to fetch weather information.",
        )


# ============================================================
# AI Trip Assistant Route
# ============================================================

@app.post("/chat")
def chat_with_trip_assistant(
    request: ChatRequest
):

    try:
        response = generate_chatbot_response(
            message=request.message,
            trip=request.trip,
            itinerary=request.itinerary,
            weather_info=request.weather_info,
            budget_plan=request.budget_plan,
            destination_plan=request.destination_plan,
            accommodation_plan=request.accommodation_plan,
        )

        return {
            "status": "success",
            **response,
        }

    except Exception as e:
        print("CHATBOT ERROR:", e)

        raise HTTPException(
            status_code=503,
            detail=(
                "AI trip assistant is temporarily "
                f"unavailable. {str(e)}"
            ),
        )


# ============================================================
# Location Routes
# ============================================================

@app.get("/locations/countries")
def locations_countries():

    try:
        return {
            "status": "success",
            "locations": get_countries(),
        }

    except Exception as e:
        print(
            "LOCATION COUNTRIES ERROR:",
            e
        )

        raise HTTPException(
            status_code=503,
            detail="Unable to load countries.",
        )


@app.get(
    "/locations/children/{geoname_id}"
)
def locations_children(
    geoname_id: int
):

    try:
        return {
            "status": "success",
            "locations": get_children(
                geoname_id
            ),
        }

    except Exception as e:
        print(
            "LOCATION CHILDREN ERROR:",
            e
        )

        raise HTTPException(
            status_code=503,
            detail="Unable to load locations.",
        )


@app.get("/locations/search")
def locations_search(
    q: str,
    country: str | None = None,
    adminCode1: str | None = None,
    adminCode2: str | None = None,
    adminCode3: str | None = None,
):

    try:
        if len(q.strip()) < 2:
            return {
                "status": "success",
                "locations": [],
            }

        return {
            "status": "success",
            "locations": search_locations(
                q.strip(),
                country,
                adminCode1,
                adminCode2,
                adminCode3,
            ),
        }

    except Exception as e:
        print(
            "LOCATION SEARCH ERROR:",
            e
        )

        raise HTTPException(
            status_code=503,
            detail="Unable to search locations.",
        )