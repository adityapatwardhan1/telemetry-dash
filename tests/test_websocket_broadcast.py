import pytest
import asyncio
import json
import websockets
import threading

from fastapi.testclient import TestClient
from backend.main import app
from backend.telemetry_ws import broadcast_telemetry
from backend.db import SessionLocal, get_db
from backend.models import User
from backend.auth import hash_password as get_password_hash


@pytest.fixture(scope="module")
def db_session():
    # Setup a test DB session, similar to your conftest.py but local here for clarity
    db = SessionLocal()
    yield db
    db.close()

@pytest.fixture(scope="module")
def client(db_session):
    # Create test user
    hashed_password = get_password_hash("admin123")
    user = db_session.query(User).filter_by(username="admin").first()
    if not user:
        user = User(username="admin", hashed_password=hashed_password, role="admin")
        db_session.add(user)
        db_session.commit()

    # Override get_db for app to use this test db_session
    def override_get_db():
        yield db_session
    app.dependency_overrides = {}
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

@pytest.mark.asyncio
async def test_websocket_broadcast(client):
    # Step 1: Login (sync, via client)
    resp = client.post("/api/login", json={"username": "admin", "password": "admin123"})
    assert resp.status_code == 200, f"Login failed: {resp.text}"
    token = resp.json().get("access_token")
    assert token is not None, "Login did not return access token"

    with client.websocket_connect(f"/ws/telemetry?token={token}") as websocket:

        async def broadcast_and_wait():
            await broadcast_telemetry({
                "device_id": "test-device",
                "battery": 77,
                "cpu_usage": 43,
                "temperature": 28,
                "timestamp": "2025-07-19T12:00:00Z"
            })
            await asyncio.sleep(1)  # wait a moment for message delivery

        await broadcast_and_wait()

        message = websocket.receive_json()
        assert message["device_id"] == "test-device"
        assert message["battery"] == 77
        assert message["cpu_usage"] == 43
        assert message["temperature"] == 28
