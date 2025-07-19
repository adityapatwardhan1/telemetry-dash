from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from backend.token_utils import decode_access_token
from backend.db import get_db
from backend.models import User, Telemetry
import json
import datetime

router = APIRouter()
connected_clients = set()

def parse_timestamp(ts_str: str) -> datetime.datetime:
    """
    Parse an ISO 8601 timestamp string to datetime

    :param ts_str: ISO 8601 timestamp string
    :type ts_str: str
    :return: Parsed datetime or current UTC datetime on failure
    :rtype: datetime.datetime
    """
    try:
        if ts_str.endswith("Z"):
            ts_str = ts_str[:-1] + "+00:00"
        return datetime.datetime.fromisoformat(ts_str)
    except Exception:
        return datetime.datetime.now(datetime.timezone.utc)

@router.websocket("/ws/telemetry")
async def telemetry_websocket(websocket: WebSocket):
    """
    WebSocket endpoint to receive authenticated telemetry data and save to DB

    :param websocket: WebSocket connection
    :type websocket: WebSocket
    """
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

    db = next(get_db())
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await websocket.accept()
    connected_clients.add(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received telemetry data from {username}: {data}")
            await websocket.send_text(f"Received your data: {data}")

            data_dict = json.loads(data)
            raw_ts = data_dict.get("timestamp")
            timestamp = parse_timestamp(raw_ts) if raw_ts else datetime.datetime.now(datetime.timezone.utc)

            new_telemetry_data = Telemetry(
                device_id=data_dict.get("device_id", -1),
                battery=data_dict.get("battery", 0.0),
                temperature=data_dict.get("temperature", 0.0),
                gps_lat=data_dict.get("gps_lat", ""),
                gps_long=data_dict.get("gps_long", ""),
                speed=data_dict.get("speed", 0.0),
                cpu_usage=data_dict.get("cpu_usage", 0.0),
                timestamp=timestamp
            )
            db.add(new_telemetry_data)
            db.commit()

    except WebSocketDisconnect:
        connected_clients.remove(websocket)
        print(f"Client {username} disconnected")
    finally:
        db.close()
