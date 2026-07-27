from langgraph.graph import StateGraph, START, END

from app.graph.state import TravelState
from app.graph.nodes import (
    destination_node,
    budget_node,
    accommodation_node,
    itinerary_node,
)


# Create the graph
builder = StateGraph(TravelState)


# Add nodes
builder.add_node("destination_planner", destination_node)
builder.add_node("budget_planner", budget_node)
builder.add_node("accommodation_planner", accommodation_node)
builder.add_node("itinerary_planner", itinerary_node)


# Define workflow
builder.add_edge(START, "destination_planner")
builder.add_edge("destination_planner", "budget_planner")
builder.add_edge("budget_planner", "accommodation_planner")
builder.add_edge("accommodation_planner", "itinerary_planner")
builder.add_edge("itinerary_planner", END)


# Compile graph
travel_graph = builder.compile()