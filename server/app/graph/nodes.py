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

    Destination Analysis:
    {state['destination_plan']}

    Divide the available budget into:
    - Accommodation
    - Food
    - Local transportation
    - Activities and sightseeing
    - Emergency/miscellaneous expenses

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

    Destination Analysis:
    {state['destination_plan']}

    Budget Plan:
    {state['budget_plan']}

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

    Destination Plan:
    {state['destination_plan']}

    Budget Plan:
    {state['budget_plan']}

    Accommodation Plan:
    {state['accommodation_plan']}

    Create a practical day-wise travel itinerary.
    Keep the plan within the given budget.
    """

    itinerary = generate_ai_response(prompt)

    return {
        "itinerary": itinerary
    }