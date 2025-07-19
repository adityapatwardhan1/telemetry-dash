from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from fastapi.responses import JSONResponse
from backend.token_utils import decode_access_token
from backend.db import get_db
from backend.models import User

router = APIRouter()

@router.websocket("/ws/telemetry")
async def telemetry_websocket(websocket: WebSocket):
    # Accept connection only after verifying token in query params
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    payload = decode_access_token(token)
    if not payload:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    username = payload.get("sub")
    if not username:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # Optionally check user in DB (recommended)
    db = next(get_db())
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_text()
            # Process incoming telemetry data
            print(f"Received telemetry data from {username}: {data}")
            # Echo back or send responses if needed
            await websocket.send_text(f"Received your data: {data}")

    except WebSocketDisconnect:
        print(f"Client {username} disconnected")
    finally:
        db.close()
