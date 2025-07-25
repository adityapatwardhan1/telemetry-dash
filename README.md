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
