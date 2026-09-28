"""
SQLAlchemy ORM models — the actual database tables. Kept separate from
app/models/ (Pydantic request/response schemas) to avoid confusing the
two.
"""

from datetime import datetime, timezone

from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.db.database import Base


def _utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=_utcnow)

    saved_trips = relationship(
        "SavedTrip",
        back_populates="owner",
        cascade="all, delete-orphan",
    )


class SavedTrip(Base):
    __tablename__ = "saved_trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    source_city = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=False)
    budget = Column(Float, nullable=False)
    travelers = Column(Integer, nullable=False)
    travel_type = Column(String, nullable=False)

    preferences = Column(JSON, default=list)
    itinerary = Column(Text, default="")
    budget_plan = Column(Text, default="")
    destination_plan = Column(Text, default="")
    accommodation_plan = Column(Text, default="")
    weather_info = Column(JSON, default=dict)

    saved_at = Column(DateTime, default=_utcnow)

    owner = relationship("User", back_populates="saved_trips")
