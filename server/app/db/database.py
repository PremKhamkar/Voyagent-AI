"""
Database connection and session management.

DATABASE_URL is read from the environment so the exact same code works
whether the database is:

  - a local SQLite file (default, used for local development)
  - Turso / libSQL (hosted SQLite, works fine from Vercel's serverless
    functions since it doesn't rely on a local writable disk)
  - Postgres or anything else SQLAlchemy supports

To switch later, you only need to change DATABASE_URL in the .env file.
No application code needs to change.
"""

import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./voyagent.db",
)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a DB session and guarantees it is
    closed after the request, even if an exception is raised.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Create all tables that don't already exist. Safe to call on every
    startup — it does not drop or modify existing tables.
    """
    from app.db import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
