import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export type MetricPoint = {
  timestamp: number;
  value: number;
};

export type AlertEvent = {
  time: string;
  metric: string;
  value: number;
  threshold: string;
};

type TelemetryData = {
  cpu_usage: MetricPoint[];
  battery: MetricPoint[];
  temperature: MetricPoint[];
};

type CurrentMetrics = {
  cpu: number;
  battery: number;
  temperature: number;
  speed: number;
  lastAnomalyTime: string;
};

export default function useTelemetry(deviceId: number) {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext must be used within an AuthProvider");
  const { token } = auth;

  const [telemetryData, setTelemetryData] = useState<TelemetryData>({
    cpu_usage: [],
    battery: [],
    temperature: [],
  });

  const [currentMetrics, setCurrentMetrics] = useState<CurrentMetrics>({
    cpu: 0,
    battery: 0,
    temperature: 0,
    speed: 0,
    lastAnomalyTime: "-",
  });

  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) {
      console.log("not token");
      return;
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/telemetry?token=${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc1MzA1MTUwMH0.A7wYdkR4mFPTnMGN1_dNpIq1LAU6kezVGbdeTAynQBw"}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        // If it's a known alert format
        if (msg.metric && msg.threshold) {
          setAlertEvents((prev) => [msg, ...prev].slice(0, 10));
          setCurrentMetrics((prev) => ({
            ...prev,
            lastAnomalyTime: msg.time || new Date().toISOString(),
          }));
        }

        // If it's just telemetry received confirmation (can be ignored or logged)
        if (typeof msg === "string" && msg.includes("Telemetry data received")) {
          return;
        }

        // You can also process raw telemetry echo (optional)
        // console.log("WS msg:", msg);
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    return () => {
      ws.close();
    };
  }, [token]);

  return { telemetryData, currentMetrics, alertEvents };
}

