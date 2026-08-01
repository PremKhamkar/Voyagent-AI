from app.services.places_service import (
    get_coordinates,
    get_attractions
)

latitude, longitude = get_coordinates("Goa")

places = get_attractions(latitude, longitude)

print(places)