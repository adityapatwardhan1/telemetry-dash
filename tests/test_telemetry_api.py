from backend.models import Telemetry
from datetime import datetime, timedelta, timezone

import pytest

@pytest.fixture()
def seed_telemetry(db_session):
    now = datetime.now(tz=timezone.utc)
    device_id = 101

    entries = [
        Telemetry(
            device_id=device_id,
            timestamp=now - timedelta(minutes=i),
            battery=50.0,
            temperature=22.0,
            gps_lat="0",
            gps_long="0",
            speed=0,
            cpu_usage=10,
        )
        for i in range(5)
    ]
    db_session.add_all(entries)
    db_session.commit()
    yield device_id
    db_session.query(Telemetry).filter(Telemetry.device_id == device_id).delete()
    db_session.commit()

def test_get_recent_telemetry(client, seed_telemetry):
    device_id = seed_telemetry
    response = client.get(f"/api/telemetry/recent/{device_id}?limit=3")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 3

def test_get_telemetry_since(client, seed_telemetry):
    device_id = seed_telemetry
    response = client.get(f"/api/telemetry/recent_by_time/{device_id}?minutes=10")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
