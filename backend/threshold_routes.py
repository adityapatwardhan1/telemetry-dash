from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.models import Threshold
from backend.db import get_db
from typing import List

class ThresholdCreate(BaseModel):
    device_id: int
    metric: str  # e.g., "battery", "cpu", "temperature"
    min_value: Optional[float] = None
    max_value: Optional[float] = None

class ThresholdOut(ThresholdCreate):
    id: int

    class Config:
        orm_mode = True

router = APIRouter()

@router.post("/thresholds", response_model=ThresholdOut)
def set_threshold(threshold_data: ThresholdCreate, db: Session = Depends(get_db)):
    print("in set_threshold")
    existing = db.query(Threshold).filter(
        Threshold.device_id == threshold_data.device_id,
        Threshold.metric == threshold_data.metric
    ).first()

    if existing:
        existing.min_value = threshold_data.min_value
        existing.max_value = threshold_data.max_value
    else:
        new_threshold = Threshold(**threshold_data.dict())
        db.add(new_threshold)
        db.commit()
        
    return existing or new_threshold

@router.get("/thresholds/{device_id}/{metric}", response_model=ThresholdOut)
def get_threshold(device_id: int, metric: str, db: Session = Depends(get_db)):
    threshold = db.query(Threshold).filter(
        Threshold.device_id == device_id,
        Threshold.metric == metric
    ).first()

    if not threshold:
        raise HTTPException(status_code=404, detail="Threshold not found")

    return threshold

@router.get("/thresholds/{device_id}", response_model=List[ThresholdOut])
def get_all_thresholds(device_id: int, db: Session = Depends(get_db)):
    return db.query(Threshold).filter(Threshold.device_id == device_id).all()
