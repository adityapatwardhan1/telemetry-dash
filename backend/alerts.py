from typing import Dict, Any
from sqlalchemy.orm import Session
from backend.models import Threshold  # Assuming this is your Threshold SQLAlchemy model

# Default thresholds
DEFAULTS_MIN = {
    "battery": 20.0,      # percent
    "cpu_usage": 0.0,    # percent
    "temperature": 0.0,  # Celsius
}

DEFAULTS_MAX = {
    "battery": 101.0,      # percent
    "cpu_usage": 80.0,    # percent
    "temperature": 60.0,  # Celsius
}

def check_alerts(telemetry_data: Dict[str, Any], db: Session) -> Dict[str, Any]:
    device_id = telemetry_data.get("device_id")

    thresholds = db.query(Threshold).filter(Threshold.device_id == device_id).all()
    threshold_map = {t.metric: t for t in thresholds}

    battery_threshold = threshold_map.get("battery")
    cpu_threshold = threshold_map.get("cpu_usage")
    temp_threshold = threshold_map.get("temperature")

    battery_min = battery_threshold.min_value if battery_threshold and battery_threshold.min_value is not None else DEFAULTS_MIN["battery"]
    cpu_min = cpu_threshold.min_value if cpu_threshold and cpu_threshold.min_value is not None else DEFAULTS_MIN["cpu_usage"]
    temp_min = temp_threshold.min_value if temp_threshold and temp_threshold.min_value is not None else DEFAULTS_MIN["temperature"]

    battery_max = battery_threshold.max_value if battery_threshold and battery_threshold.max_value is not None else DEFAULTS_MAX["battery"]
    cpu_max = cpu_threshold.max_value if cpu_threshold and cpu_threshold.max_value is not None else DEFAULTS_MAX["cpu_usage"]
    temp_max = temp_threshold.max_value if temp_threshold and temp_threshold.max_value is not None else DEFAULTS_MAX["temperature"]

    battery_val = telemetry_data.get("battery", 100)
    cpu_val = telemetry_data.get("cpu_usage", 100)
    temp_val = telemetry_data.get("temperature", 100)

    return {
        "battery_alert": not (battery_min <= battery_val <= battery_max),
        "cpu_usage_alert": not (cpu_min <= cpu_val <= cpu_max),
        "temperature_alert": not (temp_min <= temp_val <= temp_max),
        "battery_value": battery_val,
        "battery_bounds": (battery_min, battery_max),
        "cpu_usage_value": cpu_val,
        "cpu_usage_bounds": (cpu_min, cpu_max),
        "temperature_value": temp_val,
        "temperature_bounds": (temp_min, temp_max),
    }


def format_alert_message(device_id: int, alerts: Dict[str, bool], timestamp: str) -> Dict[str, Any]:
    """
    Format alert dictionary into broadcast-ready message.
    """
    formatted = {"device_id": device_id, "timestamp": timestamp, "alerts": alerts}
    message = "Alerts triggered:"
    if alerts.get("battery_alert", False):
        message += " battery low,"
    if alerts.get("cpu_usage_alert", False):  # Fixed key name
        message += " CPU usage high,"
    if alerts.get("temperature_alert", False):
        message += " temperature high,"
    message = message.rstrip(",") or "Alerts triggered: None"
    formatted["message"] = message
    return formatted
