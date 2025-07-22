# backend/websocket/telemetry_handler.py
import asyncio
import datetime
import json
import traceback
import contextlib

from fastapi import WebSocket, WebSocketDisconnect, status
from backend.models import Telemetry, User
from backend.alerts import check_alerts, format_alert_message
from backend.telemetry_ws import parse_timestamp

connected_clients = set()

async def send_periodic_pings(websocket: WebSocket, interval_sec: int = 10):
    try:
        while True:
            await asyncio.sleep(interval_sec)
            print("sending ping")
            await websocket.send_text("")
    except Exception as e:
        print("Ping task stopped:", e)

async def handle_telemetry_websocket(websocket: WebSocket, user: User, db):
    print(f"User '{user.username}' connected")
    await websocket.accept()
    connected_clients.add(websocket)
    ping_task = asyncio.create_task(send_periodic_pings(websocket))

    try:
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=15)
                data_dict = json.loads(data)
                raw_ts = data_dict.get("timestamp")
                timestamp = parse_timestamp(raw_ts) if raw_ts else datetime.datetime.now(datetime.timezone.utc)

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

                print(f"Saved telemetry from {user.username}: {data_dict}")

                payload = {
                    "device_id": new_telemetry.device_id,
                    "timestamp": new_telemetry.timestamp.isoformat(),
                    "battery": new_telemetry.battery,
                    "temperature": new_telemetry.temperature,
                    "cpu_usage": new_telemetry.cpu_usage,
                    "speed": new_telemetry.speed,
                    "type": "telemetry",
                }

                alerts = check_alerts(data_dict, db)
                if any(alerts.values()):
                    payload["alerts"] = alerts
                    payload["type"] = "alert"
                else:
                    payload["type"] = "telemetry"

                # alerts = check_alerts(data_dict, db)
                # if any(alerts.values()):
                #     payload["alert"] = format_alert_message(new_telemetry.device_id, alerts, raw_ts or timestamp.isoformat())

                print("sending payload")
                await websocket.send_json(payload)

            except asyncio.TimeoutError:
                print("asyncio.TimeoutError")
                continue
            except WebSocketDisconnect:
                print(f"Client '{user.username}' disconnected")
                break
            except Exception as e:
                print("Error in telemetry handling:", e)
                traceback.print_exc()
                break

    finally:
        print(f"Cleaning up connection for '{user.username}'")
        ping_task.cancel()
        with contextlib.suppress(Exception):
            await ping_task
        connected_clients.discard(websocket)
        db.close()

async def send(websocket: WebSocket, message: dict):
    try:
        await websocket.send_json(message)
    except WebSocketDisconnect:
        pass

async def broadcast_telemetry(message: dict) -> None:
    await asyncio.gather(*[send(ws, message) for ws in connected_clients])
