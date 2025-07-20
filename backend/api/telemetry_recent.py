from typing import List, Optional
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import desc
from sqlalchemy.orm import Session
from backend.models import Telemetry
from backend.db import get_db
from pydantic import BaseModel


class TelemetryOut(BaseModel):
    id: int
    device_id: int
    battery: float
    temperature: float
    gps_lat: str
    gps_long: str
    speed: float
    cpu_usage: float
    timestamp: datetime

    class Config:
        orm_mode = True

router = APIRouter()

@router.get("/telemetry/recent/{device_id}")
def get_recent_telemetry(
    device_id: int,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Fetch the most recent telemetry entries for a given device.
    """
    return (
        db.query(Telemetry)
        .filter(Telemetry.device_id == device_id)
        .order_by(desc(Telemetry.timestamp))
        .limit(limit)
        .all()
    )

@router.get("/telemetry/recent_by_time/{device_id}")
def get_telemetry_since(
    device_id: int,
    minutes: Optional[int] = 5,
    db: Session = Depends(get_db)
):
    """
    Fetch telemetry entries for a device from the last X minutes.
    """
    x_minutes_ago = datetime.now(tz=timezone.utc) - timedelta(minutes=minutes)
    return (
        db.query(Telemetry)
        .filter(Telemetry.device_id == device_id)
        .filter(Telemetry.timestamp >= x_minutes_ago)
        .all()
    )
