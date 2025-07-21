from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect, status
from backend.token_utils import decode_access_token
from backend.alerts import check_alerts, format_alert_message
from backend.db import get_db
from backend.models import User, Telemetry
import json
import datetime
import asyncio

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


import asyncio
import json
import datetime
from fastapi import WebSocket, WebSocketDisconnect, status

async def send_periodic_pings(websocket: WebSocket, interval_sec: int = 10):
    try:
        while True:
            await asyncio.sleep(interval_sec)
            # Sending an empty text message as a ping (can be customized)
            print("sending ping")
            await websocket.send_text("")
    except Exception:
        # Usually means websocket is closed or error; exit coroutine
        pass


@router.websocket("/ws/telemetry")
async def telemetry_websocket(websocket: WebSocket):
    print("in telemetry_websocket")
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

    print("accepting user")
    await websocket.accept()
    connected_clients.add(websocket)

    ping_task = asyncio.create_task(send_periodic_pings(websocket))

    try:
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=1)
                data_dict = json.loads(data)
                raw_ts = data_dict.get("timestamp")
                timestamp = parse_timestamp(raw_ts) if raw_ts else datetime.datetime.now(datetime.timezone.utc)

                # Save telemetry data to DB
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
                print(f"Saved telemetry from {username}: {data_dict}")

                # Check alerts after saving telemetry
                alerts = check_alerts(data_dict, db)
                if any(alerts.values()):
                    alert_msg = format_alert_message(
                        new_telemetry.device_id, alerts, raw_ts or timestamp.isoformat()
                    )
                    alert_msg["type"] = "alert"
                    print("alert=",alert_msg)
                    print("sending alert json")
                    await websocket.send_json(alert_msg)

            except asyncio.TimeoutError:
                # No data received in 1 sec; just continue
                pass
            except Exception as e:
                print(f"Error receiving/saving telemetry: {e}")

            # Send latest telemetry update
            latest = db.query(Telemetry).order_by(Telemetry.timestamp.desc()).first()
            if latest:
                payload = {
                    "device_id": latest.device_id,
                    "timestamp": latest.timestamp.isoformat(),
                    "battery": latest.battery,
                    "temperature": latest.temperature,
                    "cpu_usage": latest.cpu_usage,
                    "speed": latest.speed,
                    "type": "telemetry",
                }
                await websocket.send_json(payload)

            await asyncio.sleep(1)  # throttle sending frequency

    except WebSocketDisconnect:
        print(f"Client {username} disconnected")
        connected_clients.remove(websocket)
    except Exception as e:
        print("Error in websocket loop:", e)
    finally:
        ping_task.cancel()
        db.close()


# @router.websocket("/ws/telemetry")
# async def telemetry_websocket(websocket: WebSocket):
#     print("in telemetry_websocket")
#     token = websocket.query_params.get("token")
#     if not token:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     payload = decode_access_token(token)
#     if not payload:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     username = payload.get("sub")
#     if not username:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     db = next(get_db())
#     user = db.query(User).filter(User.username == username).first()
#     if user is None:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     print("accepting user")
#     await websocket.accept()
#     connected_clients.add(websocket)

#     ping_task = asyncio.create_task(send_periodic_pings(websocket))

#     try:
#         while True:
#             try:
#                 data = await asyncio.wait_for(websocket.receive_text(), timeout=1)
#                 data_dict = json.loads(data)
#                 raw_ts = data_dict.get("timestamp")
#                 timestamp = parse_timestamp(raw_ts) if raw_ts else datetime.datetime.now(datetime.timezone.utc)

#                 new_telemetry = Telemetry(
#                     device_id=data_dict.get("device_id", -1),
#                     battery=data_dict.get("battery", 0.0),
#                     temperature=data_dict.get("temperature", 0.0),
#                     gps_lat=data_dict.get("gps_lat", ""),
#                     gps_long=data_dict.get("gps_long", ""),
#                     speed=data_dict.get("speed", 0.0),
#                     cpu_usage=data_dict.get("cpu_usage", 0.0),
#                     timestamp=timestamp,
#                 )
#                 db.add(new_telemetry)
#                 db.commit()
#                 print(f"Saved telemetry from {username}: {data_dict}")
#             except asyncio.TimeoutError:
#                 # No data received in 1 sec; just continue
#                 pass
#             except Exception as e:
#                 print(f"Error receiving/saving telemetry: {e}")

#             latest = db.query(Telemetry).order_by(Telemetry.timestamp.desc()).first()
#             if latest:
#                 payload = {
#                     "device_id": latest.device_id,
#                     "timestamp": latest.timestamp.isoformat(),
#                     "battery": latest.battery,
#                     "temperature": latest.temperature,
#                     "cpu_usage": latest.cpu_usage,
#                     "speed": latest.speed,
#                     "type": "telemetry",
#                 }
#                 await websocket.send_json(payload)

#             await asyncio.sleep(1)  # throttle sending frequency

#     except WebSocketDisconnect:
#         print(f"Client {username} disconnected")
#         connected_clients.remove(websocket)
#     except Exception as e:
#         print("Error in websocket loop:", e)
#     finally:
#         ping_task.cancel()
#         db.close()



# @router.websocket("/ws/telemetry")
# async def telemetry_websocket(websocket: WebSocket):
#     print("in telemetry_websocket")
#     token = websocket.query_params.get("token")
#     if not token:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     payload = decode_access_token(token)
#     if not payload:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     username = payload.get("sub")
#     if not username:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     db = next(get_db())
#     user = db.query(User).filter(User.username == username).first()
#     if user is None:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     print("accepting user")
#     await websocket.accept()
#     connected_clients.add(websocket)

#     try:
#         while True:
#             # Check if there's incoming data to receive
#             try:
#                 data = await asyncio.wait_for(websocket.receive_text(), timeout=1)
#                 data_dict = json.loads(data)
#                 raw_ts = data_dict.get("timestamp")
#                 timestamp = parse_timestamp(raw_ts) if raw_ts else datetime.datetime.now(datetime.timezone.utc)

#                 # Save telemetry data to DB
#                 new_telemetry = Telemetry(
#                     device_id=data_dict.get("device_id", -1),
#                     battery=data_dict.get("battery", 0.0),
#                     temperature=data_dict.get("temperature", 0.0),
#                     gps_lat=data_dict.get("gps_lat", ""),
#                     gps_long=data_dict.get("gps_long", ""),
#                     speed=data_dict.get("speed", 0.0),
#                     cpu_usage=data_dict.get("cpu_usage", 0.0),
#                     timestamp=timestamp,
#                 )
#                 db.add(new_telemetry)
#                 db.commit()
#                 print(f"Saved telemetry from {username}: {data_dict}")
#             except asyncio.TimeoutError:
#                 # No data received within 1 second, that's fine — just proceed
#                 pass
#             except Exception as e:
#                 print(f"Error receiving/saving telemetry: {e}")

#             # Then send latest telemetry back every loop (every ~1 second)
#             latest = db.query(Telemetry).order_by(Telemetry.timestamp.desc()).first()
#             if latest:
#                 payload = {
#                     "device_id": latest.device_id,
#                     "timestamp": latest.timestamp.isoformat(),
#                     "battery": latest.battery,
#                     "temperature": latest.temperature,
#                     "cpu_usage": latest.cpu_usage,
#                     "speed": latest.speed,
#                     "type": "telemetry",
#                 }
#                 await websocket.send_json(payload)
#                 await asyncio.sleep(1)  # throttle sending frequency

#     except WebSocketDisconnect:
#         print(f"Client {username} disconnected")
#         connected_clients.remove(websocket)
#     except Exception as e:
#         print("Error in websocket loop:", e)
#     finally:
#         db.close()

        

# @router.websocket("/ws/telemetry")
# async def telemetry_websocket(websocket: WebSocket):
#     print("in telemetry_websocket")
#     token = websocket.query_params.get("token")
#     if not token:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     payload = decode_access_token(token)
#     if not payload:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     username = payload.get("sub")
#     if not username:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     db = next(get_db())
#     user = db.query(User).filter(User.username == username).first()
#     if user is None:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     print("accepting user")
#     await websocket.accept()
#     connected_clients.add(websocket)

#     try:
#         while True:
#             await asyncio.sleep(2)  # Stream every 2 seconds

#             latest = (
#                 db.query(Telemetry)
#                 .order_by(Telemetry.timestamp.desc())
#                 .first()
#             )
#             print("latest=", latest)
#             print("latest is truthy")
#             if latest:
#                 payload = {
#                     "device_id": latest.device_id,
#                     "timestamp": latest.timestamp.isoformat(),
#                     "battery": latest.battery,
#                     "temperature": latest.temperature,
#                     "cpu_usage": latest.cpu_usage,
#                     "speed": latest.speed,
#                     "type": "telemetry",
#                 }
#                 await websocket.send_json(payload)

#     except WebSocketDisconnect:
#         print(f"Client {username} disconnected")
#         connected_clients.remove(websocket)
#     except Exception as e:
#         print("Error sending metrics:", e)
#     finally:
#         db.close()


# @router.websocket("/ws/telemetry")
# async def telemetry_websocket(websocket: WebSocket):
#     token = websocket.query_params.get("token")
#     if not token:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     payload = decode_access_token(token)
#     print("Decoded payload:", payload)

#     if not payload:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     username = payload.get("sub")
#     print("Token subject (sub):", username)

#     if not username:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     db = next(get_db())
#     user = db.query(User).filter(User.username == username).first()
#     print("User found:", user)
#     if user is None:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     await websocket.accept()
#     connected_clients.add(websocket)

#     send_task = None

#     async def send_latest_metrics():
#         """Periodically send latest metrics to the client."""
#         try:
#             while True:
#                 await asyncio.sleep(2)  # Adjust interval as needed
#                 latest = (
#                     db.query(Telemetry)
#                     .filter_by(device_id=user.device_id)
#                     .order_by(Telemetry.timestamp.desc())
#                     .first()
#                 )
#                 if latest:
#                     payload = {
#                         "device_id": latest.device_id,
#                         "timestamp": latest.timestamp.isoformat(),
#                         "battery": latest.battery,
#                         "temperature": latest.temperature,
#                         "cpu_usage": latest.cpu_usage,
#                         "speed": latest.speed,
#                         "type": "telemetry",
#                     }
#                     await websocket.send_json(payload)
#         except Exception as e:
#             print("Error sending metrics:", e)

#     try:
#         send_task = asyncio.create_task(send_latest_metrics())

#         while True:
#             data = await websocket.receive_text()
#             print(f"Received telemetry data from {username}: {data}")

#             data_dict = json.loads(data)
#             raw_ts = data_dict.get("timestamp")
#             timestamp = parse_timestamp(raw_ts) if raw_ts else datetime.datetime.now(datetime.timezone.utc)

#             # Save telemetry data
#             new_telemetry_data = Telemetry(
#                 device_id=data_dict.get("device_id", -1),
#                 battery=data_dict.get("battery", 0.0),
#                 temperature=data_dict.get("temperature", 0.0),
#                 gps_lat=data_dict.get("gps_lat", ""),
#                 gps_long=data_dict.get("gps_long", ""),
#                 speed=data_dict.get("speed", 0.0),
#                 cpu_usage=data_dict.get("cpu_usage", 0.0),
#                 timestamp=timestamp
#             )
#             db.add(new_telemetry_data)
#             db.commit()

#             # Check alerts
#             alerts = check_alerts(data_dict, db)
#             if any(alerts.values()):
#                 alert_msg = format_alert_message(new_telemetry_data.device_id, alerts, raw_ts or timestamp.isoformat())
#                 print("sending alert json")
#                 alert_msg["type"] = "alert"
#                 await websocket.send_json(alert_msg)
#             else:
#                 print("telemetry received, no alert")
#                 await websocket.send_text("Telemetry data received and stored.")

#     except WebSocketDisconnect:
#         print(f"Client {username} disconnected")
#     finally:
#         if send_task:
#             send_task.cancel()
#         connected_clients.remove(websocket)
#         db.close()



# @router.websocket("/ws/telemetry")
# async def telemetry_websocket(websocket: WebSocket):
#     token = websocket.query_params.get("token")
#     if not token:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     payload = decode_access_token(token)
#     print("Decoded payload:", payload)

#     if not payload:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     username = payload.get("sub")
#     print("Token subject (sub):", payload.get("sub"))

#     if not username:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     db = next(get_db())
#     user = db.query(User).filter(User.username == username).first()
#     print("User found:", user)
#     if user is None:
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
#         return

#     await websocket.accept()
#     connected_clients.add(websocket)

#     try:
#         while True:
#             data = await websocket.receive_text()
#             print(f"Received telemetry data from {username}: {data}")

#             data_dict = json.loads(data)
#             raw_ts = data_dict.get("timestamp")
#             timestamp = parse_timestamp(raw_ts) if raw_ts else datetime.datetime.now(datetime.timezone.utc)

#             # Save telemetry data
#             new_telemetry_data = Telemetry(
#                 device_id=data_dict.get("device_id", -1),
#                 battery=data_dict.get("battery", 0.0),
#                 temperature=data_dict.get("temperature", 0.0),
#                 gps_lat=data_dict.get("gps_lat", ""),
#                 gps_long=data_dict.get("gps_long", ""),
#                 speed=data_dict.get("speed", 0.0),
#                 cpu_usage=data_dict.get("cpu_usage", 0.0),
#                 timestamp=timestamp
#             )
#             db.add(new_telemetry_data)
#             db.commit()

#             # Check alerts
#             alerts = check_alerts(data_dict, db)
#             if any(alerts.values()):
#                 alert_msg = format_alert_message(new_telemetry_data.device_id, alerts, raw_ts or timestamp.isoformat())
#                 print("sending json")
#                 await websocket.send_json(alert_msg)
#             else:
#                 print("sending text")
#                 await websocket.send_text("Telemetry data received and stored.")

#     except WebSocketDisconnect:
#         connected_clients.remove(websocket)
#         print(f"Client {username} disconnected")
#     finally:
#         db.close()



# @router.websocket("/ws/telemetry")
# async def telemetry_websocket(websocket: WebSocket):
#     print("New websocket connection attempt")
#     token = websocket.query_params.get("token")
#     print("Incoming token:", token)
#     payload = decode_access_token(token)
#     print("Decoded payload:", payload)
#     await websocket.accept()
#     print("WebSocket accepted")
#     try:
#         while True:
#             data = await websocket.receive_text()
#             print("Received data:", data)
#             await websocket.send_text("pong")
#     except Exception as e:
#         print("Exception:", e)
#     finally:
#         print("WebSocket closed")

# @router.websocket("/ws/telemetry")
# async def telemetry_websocket(websocket: WebSocket):
#     print("New websocket connection attempt")
#     token = websocket.query_params.get("token")
#     print("Incoming token:", token)
#     payload = decode_access_token(token)
#     print("Decoded payload:", payload)
#     await websocket.accept()
#     print("WebSocket accepted")
#     try:
#         while True:
#             data = await websocket.receive_text()
#             print("Received data:", data)
#             # Just echo back for test
#             await websocket.send_text(f"Echo: {data}")
#     except WebSocketDisconnect:
#         print("WebSocket disconnected")
#     except Exception as e:
#         print("Exception in WS handler:", e)
#     finally:
#         print("WebSocket closed")


async def send(websocket: WebSocket, message: dict):
    try:
        await websocket.send_json(message)
    except WebSocketDisconnect:
        pass

async def broadcast_telemetry(message: dict) -> None:
    """
    Broadcasts a telemetry message to all active WebSocket dashboard clients.

    :param message: Telemetry data dictionary to send.
    :type message: dict
    """
    await asyncio.gather(
        *[send(ws, message) for ws in connected_clients]
    )

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message: {data}")
