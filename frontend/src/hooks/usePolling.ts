import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { jwtDecode } from "jwt-decode";

export type MetricPoint = {
  timestamp: number;
  value: number;
};

export type AlertEvent = {
  time: string;
  metric: string;
  value: number;
  threshold: string;
  message: string;
  deviceId: string;
};

type TelemetryData = {
  cpu_usage: Record<string, MetricPoint[]>; // deviceId -> array of points
  battery: Record<string, MetricPoint[]>;
  temperature: Record<string, MetricPoint[]>;
};

type CurrentMetrics = {
  cpu: number;
  battery: number;
  temperature: number;
  speed: number;
  lastAnomalyTime: string;
};

export default function useTelemetry() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext must be used within an AuthProvider");
  const { token } = auth;

  const [telemetryData, setTelemetryData] = useState<TelemetryData>({
    cpu_usage: {},
    battery: {},
    temperature: {},
  });

  // Map deviceId -> CurrentMetrics
  const [currentMetricsByDevice, setCurrentMetricsByDevice] = useState<Record<string, CurrentMetrics>>({});

  const [alertEventsByDevice, setAlertEventsByDevice] = useState<Record<string, AlertEvent[]>>({});

  // Optional flat list of all alert events
  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {

    if (!token) {
      console.log("No token, skipping WebSocket connection");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        console.warn("Token expired, skipping WebSocket connection");
        localStorage.removeItem("token");
        return;
      }
    } catch (err) {
      console.error("Failed to decode token, skipping WebSocket connection");
      localStorage.removeItem("token");
      return;
    }


    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      ws = new WebSocket(`ws://localhost:8000/ws/telemetry?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
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
          const deviceId = msg.device_id.toString();
          const numericTimestamp = new Date(msg.timestamp).getTime();

          setTelemetryData((prev) => ({
            cpu_usage: {
              ...prev.cpu_usage,
              [deviceId]: [...(prev.cpu_usage[deviceId] ?? []), { timestamp: numericTimestamp, value: msg.cpu_usage }],
            },
            battery: {
              ...prev.battery,
              [deviceId]: [...(prev.battery[deviceId] ?? []), { timestamp: numericTimestamp, value: msg.battery }],
            },
            temperature: {
              ...prev.temperature,
              [deviceId]: [...(prev.temperature[deviceId] ?? []), { timestamp: numericTimestamp, value: msg.temperature }],
            },
          }));

          setCurrentMetricsByDevice((prev) => ({
            ...prev,
            [deviceId]: {
              cpu: msg.cpu_usage,
              battery: msg.battery,
              temperature: msg.temperature,
              speed: msg.speed,
              lastAnomalyTime: prev[deviceId]?.lastAnomalyTime ?? "-",
            },
          }));
        }

        if (msg.type === "alert") {
          const { alerts, timestamp, device_id } = msg;
          const deviceId = device_id.toString();
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
              deviceId,
            };

            setAlertEventsByDevice((prev) => {
              const updated = { ...prev };
              if (!updated[deviceId]) updated[deviceId] = [];
              updated[deviceId] = [alert, ...updated[deviceId]].slice(0, 10);
              return updated;
            });

            setAlertEvents((prev) => [alert, ...prev].slice(0, 10));

            setCurrentMetricsByDevice((prev) => ({
              ...prev,
              [deviceId]: {
                ...(prev[deviceId] || {
                  cpu: 0,
                  battery: 0,
                  temperature: 0,
                  speed: 0,
                  lastAnomalyTime: "-",
                }),
                lastAnomalyTime: timestamp,
              },
            }));
          });
        }
      };

      ws.onclose = () => {
        console.log("WebSocket closed. Reconnecting in 2s...");
        reconnectTimeout = setTimeout(connect, 2000);
      };

      ws.onerror = (e) => {
        console.error("WebSocket error:", e);
        ws.close();
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, [token]);

  return {
    telemetryData,
    currentMetricsByDevice,
    alertEventsByDevice,
    alertEvents,
  };
}

