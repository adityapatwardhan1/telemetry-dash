from typing import Dict, Any

def check_alerts(telemetry_data: Dict[str, Any]) -> Dict[str, bool]:
    """
    Check telemetry data against alert thresholds

    :param telemetry_data: Dictionary containing telemetry metrics (e.g., battery, cpu_usage, temperature).
    :return: Dictionary where keys are alert names and values are booleans indicating if alert is triggered.
    """
    BATTERY_THRESHOLD = 20.0  # percent
    CPU_THRESHOLD = 80.0      # percent
    TEMP_THRESHOLD = 60.0     # Celsius

    alerts = {
        "battery_alert": telemetry_data.get("battery", 100) < BATTERY_THRESHOLD,
        "cpu_alert": telemetry_data.get("cpu_usage", 0) > CPU_THRESHOLD,
        "temperature_alert": telemetry_data.get("temperature", 0) > TEMP_THRESHOLD
    }

    return alerts

def format_alert_message(device_id: int, alerts: Dict[str, bool], timestamp: str) -> Dict[str, Any]:
    """
    Format an alert message for broadcasting over WebSocket.

    :param device_id: The ID of the device sending the telemetry.
    :param alerts: Dictionary of triggered alerts from check_alerts().
    :param timestamp: ISO formatted timestamp string of the telemetry.
    :return: Dictionary representing the alert message to send to clients
    """
    formatted = {"device_id": device_id, "timestamp": timestamp, "alerts": alerts}
    message = "Alerts triggered:"
    if alerts.get("battery_alert", False):
        message += " battery low,"
    if alerts.get("cpu_alert", False):
        message += " CPU usage high,"
    if alerts.get("temperature_alert", False):
        message += " temperature high"
    if message.endswith(","):
        message = message[:-1]
    if message == "Alerts triggered:":
        message += " None"
    formatted["message"] = message 
    return formatted