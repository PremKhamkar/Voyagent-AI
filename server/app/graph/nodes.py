from app.services.weather_service import get_weather
from app.graph.state import TravelState
from app.services.groq_service import generate_ai_response
from app.services.places_service import (
    get_coordinates,
    get_attractions
)


def destination_node(state: TravelState):

    print("LangGraph: Destination Node Running...")
    
    attractions = []

    try:
        latitude, longitude = get_coordinates(
            state["destination"]
        )

        attractions = get_attractions(
            latitude,
            longitude
        )

        attractions = attractions[:15]
    except Exception as e:
        print(f"Places Error: {e}")

    print(attractions)

    prompt = f"""
    You are a destination planning specialist for a travel application.

    Analyze the following trip:

    Source City: {state['source_city']}
    Destination: {state['destination']}
    Start Date: {state['start_date']}
    End Date: {state['end_date']}
    Travelers: {state['travelers']}
    Travel Type: {state['travel_type']}
    Preferences: {", ".join(state['preferences'])}

    Available Attractions:
    {", ".join(attractions)}

    Instructions:

    - Select only the most famous tourist attractions.
    - Ignore duplicates.
    - Ignore unknown places.
    - Select at most five attractions.
    - Prioritize places that tourists usually visit.

    Create a concise destination plan containing:

    1. Top attractions
    2. Recommended activities
    3. Food recommendations
    4. Suitable accommodation areas
    5. Transportation suggestions
    6. Safety recommendations
    7. Weather-related advice

    Use the following format:

    Top Attractions:
    - ...

    Recommended Activities:
    - ...

    Food Recommendations:
    - ...

    Accommodation Areas:
    - ...

    Transportation:
    - ...

    Safety Tips:
    - ...

    Weather Advice:
    - ...

    Keep the response concise and well organized.

    Do not create a complete day-wise itinerary.
    This information will be passed to other travel planning agents.
    """

    destination_plan = generate_ai_response(
    prompt,
    max_completion_tokens=1200
)

    print(destination_plan)

    return {
    "destination_plan": destination_plan
    }
    
def weather_node(state: TravelState):

    print("LangGraph: Weather Node Running...")

    weather = get_weather(state["destination"])

    weather_info = f"""
Current Weather in {weather['city']}, {weather['country']}:

Temperature: {weather['temperature']}°C
Feels Like: {weather['feels_like']}°C
Condition: {weather['weather']}
Humidity: {weather['humidity']}%
Wind Speed: {weather['wind_speed']} m/s
"""

    return {
        "weather_info": weather_info
    }


def budget_node(state: TravelState):

    print("LangGraph: Budget Node Running...")

    prompt = f"""
You are a travel budget planner.

Create a practical budget plan for this trip.

Source City: {state['source_city']}
Destination: {state['destination']}
Start Date: {state['start_date']}
End Date: {state['end_date']}
Total Budget: ₹{state['budget']}
Travelers: {state['travelers']}
Travel Type: {state['travel_type']}
Preferences: {", ".join(state['preferences'])}
Weather Information:
{state['weather_info']}

Destination Analysis:
{state['destination_plan']}

    Divide the available budget into:
- Accommodation
- Food
- Local transportation
- Activities and sightseeing
- Emergency/miscellaneous expenses

Consider the current weather while planning the budget.

For example:
- If rain is expected, keep some budget for umbrellas/raincoats or indoor activities.
- If it is very hot, consider drinking water, cooling and transport expenses.
- If the weather is pleasant, outdoor activities can be given more importance.

Keep the total allocation within ₹{state['budget']}.
    """

    budget_plan = generate_ai_response(
    prompt,
    max_completion_tokens=1000
)

    return {
        "budget_plan": budget_plan
    }


def accommodation_node(state: TravelState):

    print("LangGraph: Accommodation Node Running...")

    prompt = f"""
You are an accommodation planning specialist.

Plan suitable accommodation options for this trip.

Source City: {state['source_city']}
Destination: {state['destination']}
Start Date: {state['start_date']}
End Date: {state['end_date']}
Total Budget: ₹{state['budget']}
Travelers: {state['travelers']}
Travel Type: {state['travel_type']}
Preferences: {", ".join(state['preferences'])}
Weather Information:
{state['weather_info']}

    Destination Analysis:
    {state['destination_plan']}

    Budget Plan:
    {state['budget_plan']}
    
    Consider the weather while recommending accommodation.

For example:
- During rainy weather, prefer hotels with good indoor facilities.
- During hot weather, recommend air-conditioned accommodation.
- During cold weather, recommend comfortable heated accommodation if available.

    Recommend:
    - Suitable areas/neighborhoods to stay
    - Appropriate accommodation type
    - Approximate accommodation budget
    - Why the suggested area fits the travelers
    - Important accommodation considerations

    Stay within the accommodation allocation from the budget plan.

    Do not invent real-time hotel prices or availability.
    Do not create the complete itinerary.
    """

    accommodation_plan = generate_ai_response(
    prompt,
    max_completion_tokens=1000
)

    return {
        "accommodation_plan": accommodation_plan
    }


def itinerary_node(state: TravelState):

    print("LangGraph: Itinerary Node Running...")

    prompt = f"""
Create a complete, practical and user-friendly travel itinerary.

TRIP DETAILS

From:
{state['source_city']}

Destination:
{state['destination']}

Start Date:
{state['start_date']}

End Date:
{state['end_date']}

Budget:
₹{state['budget']}

Travelers:
{state['travelers']}

Travel Style:
{state['travel_type']}

Preferences:
{", ".join(state['preferences'])}

WEATHER

{state['weather_info']}

DESTINATION RECOMMENDATIONS

{state['destination_plan']}

BUDGET PLAN

{state['budget_plan']}

ACCOMMODATION

{state['accommodation_plan']}


IMPORTANT:

The trip runs from {state['start_date']} to {state['end_date']}.

Calculate the number of travel days correctly.

You MUST generate an entry for EVERY date.

Do NOT skip any date.

Do NOT stop before the final date.


FOR EVERY DAY USE THIS EXACT STRUCTURE:

## Day X — Date

### 🌅 Morning

**📍 Activity:** Activity name

Short, easy-to-understand description of what the traveler should do.

**🍳 Meal:** Suggested breakfast or meal.

**🚗 Transport:** Recommended way to reach the location.

### ☀️ Afternoon

**📍 Activity:** Activity name

Short description explaining what the traveler should do.

**🍴 Meal:** Suggested lunch or meal.

**🚗 Transport:** Recommended transportation.

### 🌆 Evening

**📍 Activity:** Activity name

Short description explaining the activity.

**🍽️ Meal:** Suggested dinner or meal.

**🚗 Transport:** Recommended transportation.

### 💰 Estimated Cost

₹ amount for the day.

### 💡 Travel Tip

One useful practical tip for this day.


PLANNING RULES:

- Keep the itinerary realistic.
- Avoid packing too many attractions into one day.
- Group nearby attractions together.
- Consider realistic travel time between locations.
- Consider the user's travel style.
- Prioritize the user's selected preferences.
- Include meals naturally.
- Include transportation where useful.
- Keep the complete trip within the specified budget.
- Do not invent exact real-time prices.
- Use approximate costs when necessary.
- Do not unnecessarily repeat major attractions.


WEATHER RULES:

- Consider the weather information when planning each day.
- Schedule outdoor activities when weather is suitable.
- During rain, prioritize museums, cafés, malls, indoor attractions and other suitable activities.
- During extreme heat, avoid excessive outdoor activities during the hottest hours.
- Mention appropriate weather precautions.


SAFETY RULES:

- Never recommend unsafe activities.
- Never recommend water sports during monsoon or dangerous weather.
- Never recommend trekking during heavy rain.
- Never recommend beach bonfires during heavy rain.
- Avoid waterfalls during storms or heavy rainfall.
- Prioritize traveler safety.


OUTPUT RULES:

- Generate ALL dates from the start date through the end date.
- Start directly with Day 1.
- Do not add a long introduction.
- Do not add a separate conclusion.
- Keep descriptions concise and easy to understand.
- Do not use a large table.
- Make the itinerary comfortable and practical for real travelers.
"""

    itinerary = generate_ai_response(
        prompt,
        max_completion_tokens=3000
    )

    print("\n========== ITINERARY ==========\n")
    print(itinerary)
    print("\n===============================\n")

    return {
        "itinerary": itinerary
    }