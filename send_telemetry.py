import asyncio
import websockets
import json
import random
import datetime

WS_URL = "ws://localhost:8000/ws/device"

def generate_fake_telemetry():
    return {
        "device_id": random.randint(1, 5),
        "battery": round(random.uniform(0, 100), 2),
        "temperature": round(random.uniform(-20, 50), 2),
        "gps_lat": f"{round(random.uniform(-90, 90), 6)}",
        "gps_long": f"{round(random.uniform(-180, 180), 6)}",
        "speed": round(random.uniform(0, 120), 2),
        "cpu_usage": round(random.uniform(0, 100), 2),
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

async def send_telemetry(time_interval_sec=1):
    async with websockets.connect(WS_URL) as websocket:
        while True:
            data = generate_fake_telemetry()
            await websocket.send(json.dumps(data))
            print(f"Sent: {data}")
            await asyncio.sleep(time_interval_sec)

if __name__ == "__main__":
    asyncio.run(send_telemetry())
