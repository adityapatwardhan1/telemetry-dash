from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from backend.dependencies import decode_access_token, get_db
from backend.models import Telemetry, User
from backend.alerts import check_alerts, format_alert_message

import asyncio
import datetime
import json
import traceback
import contextlib

router = APIRouter()
connected_clients = set()

def parse_timestamp(ts_str: str) -> datetime.datetime:
    try:
        if ts_str.endswith("Z"):
            ts_str = ts_str[:-1] + "+00:00"
        return datetime.datetime.fromisoformat(ts_str)
    except Exception:
        return datetime.datetime.now(datetime.timezone.utc)

async def send_periodic_pings(websocket: WebSocket, interval_sec: int = 10):
    try:
        while True:
            await asyncio.sleep(interval_sec)
            await websocket.send_text("")
    except Exception as e:
        print("Ping task stopped:", e)

def make_json_safe(data: dict):
    def convert(obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return obj

    return json.loads(json.dumps(data, default=convert))

async def send_json_safe(websocket: WebSocket, message: dict):
    try:
        await websocket.send_json(make_json_safe(message))
    except Exception as e:
        print("Client disconnected unexpectedly")
        if websocket in connected_clients:
            connected_clients.remove(websocket)


async def broadcast_telemetry(message: dict):
    await asyncio.gather(*(send_json_safe(ws, message) for ws in connected_clients))


@router.websocket("/ws/device")
async def device_websocket(websocket: WebSocket):
    print("📡 Device connected")
    await websocket.accept()
    db = next(get_db())
    try:
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30)
                data_dict = json.loads(data)
                timestamp = parse_timestamp(data_dict.get("timestamp"))

                new_telemetry = Telemetry(
                    device_id=data_dict.get("device_id", -1),
                    battery=data_dict.get("battery", 0.0),
                    temperature=data_dict.get("temperature", 0.0),
                    gps_lat=data_dict.get("gps_lat", ""),
                    gps_long=data_dict.get("gps_long", ""),
                    speed=data_dict.get("speed", 0.0),
                    cpu_usage=data_dict.get("cpu_usage", 0.0),
                    timestamp=timestamp,
                )

                db.add(new_telemetry)
                db.commit()

                telemetry_payload = {
                    "device_id": new_telemetry.device_id,
                    "timestamp": new_telemetry.timestamp.isoformat(),
                    "battery": new_telemetry.battery,
                    "temperature": new_telemetry.temperature,
                    "cpu_usage": new_telemetry.cpu_usage,
                    "speed": new_telemetry.speed,
                    "type": "telemetry",
                }

                await broadcast_telemetry(telemetry_payload)

                alerts = check_alerts(telemetry_payload, db)

                # Check if any alert is true to broadcast
                if any(alerts.get(f"{metric}_alert") for metric in ["battery", "cpu_usage", "temperature"]):
                    alert_msg = format_alert_message(alerts, telemetry_payload, new_telemetry.timestamp)

                    # Build a flattened alerts dict with keys per metric
                    structured_alert = {}
                    for metric in ["battery", "cpu_usage", "temperature"]:
                        alert_key = f"{metric}_alert"
                        value_key = f"{metric}_value"
                        bounds_key = f"{metric}_bounds"

                        # Defensive fallback if keys missing
                        structured_alert[alert_key] = alerts.get(alert_key, False)
                        structured_alert[value_key] = alerts.get(value_key, None)
                        structured_alert[bounds_key] = alerts.get(bounds_key, None)

                    alert_payload = {
                        "type": "alert",
                        "device_id": new_telemetry.device_id,
                        "timestamp": new_telemetry.timestamp.isoformat(),
                        "message": alert_msg,
                        "alerts": structured_alert,  # Flattened, consistent structure
                    }

                    await broadcast_telemetry(alert_payload)

            except asyncio.TimeoutError:
                print("⏱ Device timeout, waiting for new data...")
                continue
            except WebSocketDisconnect:
                print("📴 Device disconnected")
                break
            except Exception:
                traceback.print_exc()
                break
    finally:
        db.close()


@router.websocket("/ws/telemetry")
async def telemetry_websocket(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not token or not (payload := decode_access_token(token)):
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    username = payload.get("sub")
    db = next(get_db())
    user = db.query(User).filter(User.username == username).first()
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await websocket.accept()
    connected_clients.add(websocket)
    print(f"✅ Dashboard user '{username}' connected")

    ping_task = asyncio.create_task(send_periodic_pings(websocket))

    try:
        while True:
            await asyncio.sleep(3600)  # Just keep connection alive
    except WebSocketDisconnect:
        print(f"🔌 Dashboard '{username}' disconnected")
    finally:
        ping_task.cancel()
        with contextlib.suppress(Exception):
            await ping_task
        connected_clients.discard(websocket)
        db.close()
