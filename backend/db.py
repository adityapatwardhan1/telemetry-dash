# Imports
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pathlib import Path

# Always resolve relative to the backend directory
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "telemetry_dash.db"
engine = create_engine(f"sqlite:///{DB_PATH}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Returns a SessionLocal object to obtain access to the database"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

