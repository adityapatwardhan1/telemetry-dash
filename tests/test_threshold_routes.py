import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.main import app
from backend.db import get_db
from backend.models import Base, Threshold, User

TEST_DATABASE_URL = "sqlite:///./test_thresholds.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()

@pytest.fixture(autouse=True)
def override_get_db(db_session):
    def _get_db():
        yield db_session
    app.dependency_overrides[get_db] = _get_db

@pytest.mark.parametrize("metric,min_value,max_value", [
    ("battery", 10.0, 50.0),
    ("cpu_usage", 20.0, 80.0),
    ("temperature", 5.0, 60.0),
])
def test_set_and_get_thresholds_for_metrics(db_session, metric, min_value, max_value):
    # Optional: Insert user if needed
    test_user = User(username="admin", hashed_password="admin123", role="admin")
    db_session.add(test_user)
    db_session.commit()

    device_id = 1
    payload = {
        "device_id": device_id,
        "metric": metric,
        "min_value": min_value,
        "max_value": max_value,
    }

    # Set threshold for this metric
    response = client.post("/thresholds", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["device_id"] == device_id
    assert data["metric"] == metric
    assert data["min_value"] == min_value
    assert data["max_value"] == max_value

    # Get all thresholds for the device
    response = client.get(f"/thresholds/{device_id}")
    assert response.status_code == 200, response.text
    thresholds = response.json()
    # Should have at least this one threshold (could be multiple if previous tests add more)
    # Find the threshold for this metric
    matching = [t for t in thresholds if t["metric"] == metric]
    assert len(matching) == 1
    t = matching[0]
    assert t["device_id"] == device_id
    assert t["min_value"] == min_value
    assert t["max_value"] == max_value
