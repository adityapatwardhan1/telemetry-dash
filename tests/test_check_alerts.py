import pytest
from backend.models import Threshold
from backend.alerts import check_alerts

def test_check_alerts_with_custom_thresholds(db_session):
    # Insert per-metric thresholds for device 123
    db_session.add_all([
        Threshold(device_id=123, metric="battery", min_value=30.0),
        Threshold(device_id=123, metric="cpu_usage", max_value=90.0),
        Threshold(device_id=123, metric="temperature", max_value=75.0),
    ])
    db_session.commit()

    telemetry_data = {
        "device_id": 123,
        "battery": 25,        # < 30 → alert
        "cpu_usage": 80,      # < 90 → ok
        "temperature": 80     # > 75 → alert
    }

    alerts = check_alerts(telemetry_data, db_session)
    assert alerts == {
        "battery_alert": True,
        "cpu_usage_alert": False,
        "temperature_alert": True
    }

def test_check_alerts_with_no_custom_thresholds(db_session):
    telemetry_data = {
        "device_id": 999,     # No threshold in DB
        "battery": 15,        # < default 20 → alert
        "cpu_usage": 85,      # > default 80 → alert
        "temperature": 55     # < default 60 → ok
    }

    alerts = check_alerts(telemetry_data, db_session)
    assert alerts == {
        "battery_alert": True,
        "cpu_usage_alert": True,
        "temperature_alert": False
    }
