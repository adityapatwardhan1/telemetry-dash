from fastapi import APIRouter, Depends
from backend.dependencies import get_current_user
from backend.models import User

router = APIRouter()

@router.get("/telemetry")
async def read_telemetry(current_user: User = Depends(get_current_user)):
    return {"data": "your telemetry data here"}
