from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash = Column(String, nullable=False)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    
    

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    source_city = Column(String, nullable=True)
    destination = Column(String, nullable=False)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    budget = Column(Integer, nullable=True)
    travelers = Column(Integer, nullable=True)
    travel_type = Column(String, nullable=True)
    preferences = Column(JSON, nullable=True)

    itinerary = Column(Text, nullable=True)
    weather_info = Column(JSON, nullable=True)
    budget_plan = Column(Text, nullable=True)
    destination_plan = Column(Text, nullable=True)
    accommodation_plan = Column(Text, nullable=True)

    saved_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
    )