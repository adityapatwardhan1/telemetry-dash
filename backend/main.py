# Run from project root
# python -m uvicorn backend.main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import auth, telemetry, telemetry_ws, telemetry_recent
from backend.threshold_routes import router as threshold_router

app = FastAPI()

# Include routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(telemetry.router, prefix="/api", tags=["telemetry"])
app.include_router(telemetry_recent.router, prefix="/api", tags=["telemetry"])
app.include_router(threshold_router)

# WebSocket endpoint
app.include_router(telemetry_ws.router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only — restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
