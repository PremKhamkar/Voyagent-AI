from app.services.places_service import get_attractions, get_coordinates

latitude, longitude = get_coordinates("Goa")

places = get_attractions(latitude, longitude)

print(places)
