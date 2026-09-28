from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.database import get_db
from app.db.models import SavedTrip, User
from app.models.saved_trip import SavedTripCreate, SavedTripOut

router = APIRouter(prefix="/trips", tags=["trips"])


def _to_out(trip: SavedTrip) -> SavedTripOut:
    """Maps the snake_case DB row onto the camelCase API response shape."""
    return SavedTripOut(
        id=trip.id,
        sourceCity=trip.source_city,
        destination=trip.destination,
        startDate=trip.start_date,
        endDate=trip.end_date,
        budget=trip.budget,
        travelers=trip.travelers,
        travelType=trip.travel_type,
        preferences=trip.preferences or [],
        itinerary=trip.itinerary or "",
        budgetPlan=trip.budget_plan or "",
        destinationPlan=trip.destination_plan or "",
        accommodationPlan=trip.accommodation_plan or "",
        weatherInfo=trip.weather_info or {},
        savedAt=trip.saved_at,
    )


@router.post("", response_model=SavedTripOut, status_code=status.HTTP_201_CREATED)
def create_trip(
    payload: SavedTripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = SavedTrip(
        user_id=current_user.id,
        source_city=payload.sourceCity,
        destination=payload.destination,
        start_date=payload.startDate,
        end_date=payload.endDate,
        budget=payload.budget,
        travelers=payload.travelers,
        travel_type=payload.travelType,
        preferences=payload.preferences,
        itinerary=payload.itinerary,
        budget_plan=payload.budgetPlan,
        destination_plan=payload.destinationPlan,
        accommodation_plan=payload.accommodationPlan,
        weather_info=payload.weatherInfo,
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return _to_out(trip)


@router.get("", response_model=list[SavedTripOut])
def list_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trips = (
        db.query(SavedTrip)
        .filter(SavedTrip.user_id == current_user.id)
        .order_by(SavedTrip.saved_at.desc())
        .all()
    )
    return [_to_out(t) for t in trips]


@router.get("/{trip_id}", response_model=SavedTripOut)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = (
        db.query(SavedTrip)
        .filter(SavedTrip.id == trip_id, SavedTrip.user_id == current_user.id)
        .first()
    )
    if trip is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found.",
        )
    return _to_out(trip)


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    trip = (
        db.query(SavedTrip)
        .filter(SavedTrip.id == trip_id, SavedTrip.user_id == current_user.id)
        .first()
    )
    if trip is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found.",
        )

    db.delete(trip)
    db.commit()
