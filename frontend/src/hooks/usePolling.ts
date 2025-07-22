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
  message?: string;
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
      console.log("No token, skipping WebSocket connection");
      return;
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/telemetry?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected to telemetry endpoint");
      // Dashboard does not send telemetry data here, only listens.
    };

    ws.onmessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
        console.log("Received WS message:", msg);
      } catch {
        console.log("Non-JSON WS message:", event.data);
        return;
      }

      if (msg.type === "telemetry") {
        const numericTimestamp = new Date(msg.timestamp).getTime();

        setTelemetryData((prev) => ({
          cpu_usage: [...prev.cpu_usage, { timestamp: numericTimestamp, value: msg.cpu_usage }],
          battery: [...prev.battery, { timestamp: numericTimestamp, value: msg.battery }],
          temperature: [...prev.temperature, { timestamp: numericTimestamp, value: msg.temperature }],
        }));

        setCurrentMetrics((prev) => ({
          ...prev,
          cpu: msg.cpu_usage,
          battery: msg.battery,
          temperature: msg.temperature,
          speed: msg.speed,
        }));
      }

      if (msg.type === "alert") {
        const { alerts, timestamp } = msg;
        console.log("message of type alert");
        console.log("alerts =", alerts);
        console.log("msg =", msg);
        const triggeredMetrics = Object.entries(alerts)
          .filter(([key, val]) => key.endsWith("_alert") && val === true)
          .map(([key]) => key.replace("_alert", ""));

        triggeredMetrics.forEach((metric) => {
          const alert: AlertEvent = {
            time: timestamp,
            metric,
            value: alerts[`${metric}_value`],
            threshold: `${alerts[`${metric}_bounds`][0]} - ${alerts[`${metric}_bounds`][1]}`,
            message: msg.message,
          };

          setAlertEvents((prev) => [alert, ...prev].slice(0, 10));
          setCurrentMetrics((prev) => ({
            ...prev,
            lastAnomalyTime: timestamp,
          }));
        });
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
