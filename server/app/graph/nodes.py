from app.services.weather_service import get_weather
from app.graph.state import TravelState
from app.services.groq_service import generate_ai_response


def destination_node(state: TravelState):

    print("LangGraph: Destination Node Running...")

    prompt = f"""
    You are a destination planning specialist for a travel application.

    Analyze the following trip:

    Destination: {state['destination']}
    Start Date: {state['start_date']}
    End Date: {state['end_date']}
    Travelers: {state['travelers']}
    Travel Type: {state['travel_type']}
    Preferences: {", ".join(state['preferences'])}

    Create a concise destination plan containing:

    - Best areas or places to visit
    - Major attractions
    - Activities matching the traveler's preferences
    - Suitable areas to stay
    - Useful local travel considerations

    Do not create the complete day-wise itinerary.
    This information will be passed to other travel planning agents.
    """

    destination_plan = generate_ai_response(prompt)

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

    Destination: {state['destination']}
    Start Date: {state['start_date']}
    End Date: {state['end_date']}
    Total Budget: ₹{state['budget']}
    Travelers: {state['travelers']}
    Travel Type: {state['travel_type']}
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

    budget_plan = generate_ai_response(prompt)

    return {
        "budget_plan": budget_plan
    }


def accommodation_node(state: TravelState):

    print("LangGraph: Accommodation Node Running...")

    prompt = f"""
    You are an accommodation planning specialist.

    Plan suitable accommodation options for this trip.

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

    accommodation_plan = generate_ai_response(prompt)

    return {
        "accommodation_plan": accommodation_plan
    }


def itinerary_node(state: TravelState):

    print("LangGraph: Itinerary Node Running...")

    prompt = f"""
    Create a detailed travel itinerary based on the following information.

    Destination: {state['destination']}
    Start Date: {state['start_date']}
    End Date: {state['end_date']}
    Budget: ₹{state['budget']}
    Travelers: {state['travelers']}
    Travel Type: {state['travel_type']}
    Preferences: {", ".join(state['preferences'])}
    Weather Information:
    {state['weather_info']}

    Destination Plan:
    {state['destination_plan']}

    Budget Plan:
    {state['budget_plan']}

    Accommodation Plan:
    {state['accommodation_plan']}

    Create a practical day-wise travel itinerary.

    Use the weather information while planning.

    For example:
    - Schedule outdoor sightseeing when the weather is pleasant.
    - If rain is expected, include indoor attractions like museums, shopping malls or cafes.
    - Mention any weather precautions if necessary.

    Keep the plan within the given budget.
    """

    itinerary = generate_ai_response(prompt)

    return {
        "itinerary": itinerary
    }