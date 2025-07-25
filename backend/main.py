from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from backend.api import auth, telemetry, telemetry_recent
from backend.telemetry_ws import router as telemetry_ws_router
from backend.threshold_routes import router as threshold_router
from backend.websocket.telemetry_handler import handle_telemetry_websocket
from backend.websocket.dashboard_handler import handle_dashboard_websocket

app = FastAPI()

# Routers
# app.include_router(auth.router, prefix="/api", tags=["auth"])
# app.include_router(telemetry.router, prefix="/api", tags=["telemetry"])
# app.include_router(telemetry_recent.router, prefix="/api", tags=["telemetry"])
# app.include_router(threshold_router)
# app.include_router(telemetry_ws_router)
# Routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(telemetry.router, prefix="/api", tags=["telemetry"])
app.include_router(telemetry_recent.router, prefix="/api", tags=["telemetry"])
app.include_router(threshold_router, prefix="/api", tags=["thresholds"]) 
app.include_router(telemetry_ws_router)


# WebSocket endpoints
@app.websocket("/ws/telemetry")
async def telemetry_ws_endpoint(ws: WebSocket):
    await handle_telemetry_websocket(ws)

@app.websocket("/ws/dashboard")
async def dashboard_ws_endpoint(ws: WebSocket):
    await handle_dashboard_websocket(ws)

# CORS (for dev only — restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
