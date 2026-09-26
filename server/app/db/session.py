import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

# ============================================================
# Database URL
#
# Defaults to a local SQLite file for the prototype.
#
# To move to Postgres later, set DATABASE_URL in server/.env,
# e.g.:
#   DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/voyagent
#
# No other code in this module needs to change for that switch.
# ============================================================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./voyagent.db",
)

# SQLite needs this flag when used with FastAPI's threaded
# request handling. Other databases don't need/accept it.
connect_args = (
    {"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {}
)

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
    FastAPI dependency that yields a DB session and
    guarantees it is closed after the request.
    """

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()