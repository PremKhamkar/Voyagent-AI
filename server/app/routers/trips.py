from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.models import Trip, User
from app.db.session import get_db
from app.models.saved_trip import SaveTripRequest, SavedTripResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/trips", tags=["trips"])


def to_response(trip: Trip) -> SavedTripResponse:
    return SavedTripResponse(
        id=trip.id,
        savedAt=trip.saved_at,
        sourceCity=trip.source_city,
        destination=trip.destination,
        startDate=trip.start_date,
        endDate=trip.end_date,
        budget=trip.budget,
        travelers=trip.travelers,
        travelType=trip.travel_type,
        preferences=trip.preferences or [],
        itinerary=trip.itinerary or "",
        weatherInfo=trip.weather_info,
        budgetPlan=trip.budget_plan or "",
        destinationPlan=trip.destination_plan or "",
        accommodationPlan=trip.accommodation_plan or "",
    )


# ============================================================
# Save a trip
# ============================================================

@router.post(
    "",
    response_model=SavedTripResponse,
    status_code=201,
)
def save_trip(
    payload: SaveTripRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    # Same duplicate check the old frontend code did:
    # same destination/dates/budget for this user is
    # treated as "already saved" instead of a new entry.
    existing = (
        db.query(Trip)
        .filter(
            Trip.user_id == current_user.id,
            Trip.destination == payload.destination,
            Trip.start_date == payload.startDate,
            Trip.end_date == payload.endDate,
            Trip.budget == payload.budget,
        )
        .first()
    )

    if existing:
        return to_response(existing)

    trip = Trip(
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
        weather_info=payload.weatherInfo,
        budget_plan=payload.budgetPlan,
        destination_plan=payload.destinationPlan,
        accommodation_plan=payload.accommodationPlan,
    )

    db.add(trip)
    db.commit()
    db.refresh(trip)

    return to_response(trip)


# ============================================================
# List my trips
# ============================================================

@router.get(
    "",
    response_model=List[SavedTripResponse],
)
def list_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    trips = (
        db.query(Trip)
        .filter(Trip.user_id == current_user.id)
        .order_by(Trip.saved_at.desc())
        .all()
    )

    return [to_response(trip) for trip in trips]


# ============================================================
# Delete a trip
# ============================================================

@router.delete(
    "/{trip_id}",
    status_code=204,
)
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    trip = (
        db.query(Trip)
        .filter(
            Trip.id == trip_id,
            Trip.user_id == current_user.id,
        )
        .first()
    )

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found.",
        )

    db.delete(trip)
    db.commit()