# Imports
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Connect to SQLite database
engine = create_engine('sqlite:///./telemetry_dash.db')
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

