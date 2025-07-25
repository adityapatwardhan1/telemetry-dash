# TeleDash

A real-time dashboard for visualizing system telemetry from multiple (simulated) devices, with alert logging and configurable thresholds.

## Features

- Live graphs for CPU usage, battery level, and temperature per device

- Rule-based threshold alerting with logs

- Admin-only threshold configuration interface

- Event log table showing triggered alerts by device

- Device selector with instant updates to all views

## Tech Stack

- Frontend: React + TypeScript + TailwindCSS

- Backend: FastAPI (Python)

- Data Polling: Custom React hook with live endpoint polling

- Charting: Recharts for clean, responsive graphs

## API Endpoints

### WebSocket Endpoints

/ws/device:
Receives real-time telemetry from devices and broadcasts alerts when thresholds are breached.

/ws/telemetry?token=...:
Secure WebSocket for dashboards to receive live telemetry and alert updates.

### Threshold Routes

GET /api/thresholds:
Returns all thresholds for all devices.

GET /api/thresholds/{device_id}:
Returns all thresholds for a specific device.

GET /api/thresholds/{device_id}/{metric}:
Returns the threshold for a specific device and metric.

POST /api/thresholds:
Creates or updates a threshold.
Body:

    device_id: integer

    metric: string (e.g. "cpu_usage", "battery", "temperature")

    min_value: float (optional)

    max_value: float (optional)


## Local Development

1. Clone the repo

2. Start backend: 
    
From the root folder, run

```
uvicorn main:app --reload
```

3. Start frontend: 

From frontend/, run

```
npm install
npm run dev
```

Frontend served at localhost:5173, backend at localhost:8000.
