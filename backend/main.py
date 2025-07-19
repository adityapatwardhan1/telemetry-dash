# Run from project root
# python -m uvicorn backend.main:app --reload

from fastapi import FastAPI
from backend.api import auth, telemetry, telemetry_ws

app = FastAPI()

app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(telemetry.router, prefix="/api", tags=["telemetry"])
app.include_router(telemetry_ws.router)  # No prefix needed for WebSocket

