import asyncio
import websockets
import json
import os
import random
import datetime
from dotenv import load_dotenv

load_dotenv()

JWT_TOKEN = os.getenv("JWT_TOKEN")
WS_URL = f"ws://localhost:8000/ws/telemetry?token={JWT_TOKEN}"

def generate_fake_telemetry():
    """
    Generates fake telemetry data for the purposes of app demonstration
    """
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
    """
    Sends telemetry data to the server for demonstration purposes
    :param time_interval_sec: Number of seconds between sending each data point
    :type time_interval_sec: int
    """
    if not JWT_TOKEN:
        raise Exception("JWT_TOKEN not found in .env file, specify a value for JWT_TOKEN")

    headers = {
        "Authorization": f"Bearer {JWT_TOKEN}"
    }

    async with websockets.connect(WS_URL, additional_headers=headers) as websocket:
        # Generate fake data, sending one data entry per second
        while True:
            data = generate_fake_telemetry()
            await websocket.send(json.dumps(data))
            print(f"Sent: {data}")
            await asyncio.sleep(time_interval_sec)

# Run script to send synthetic data
if __name__ == "__main__":
    asyncio.run(send_telemetry())
