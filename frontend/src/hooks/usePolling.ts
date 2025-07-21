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
      console.log('returning');
      return;
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/telemetry?token=${token}`);

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(
        JSON.stringify({
          device_id: deviceId,
          timestamp: new Date().toISOString(),
          temperature: 0,
          battery: 0,
          cpu_usage: 0,
          speed: 0,
        })
      );
    };


    // ws.onmessage = (event) => {
    //   try {
    //     const msg = JSON.parse(event.data);

    //     // If it's a known alert format
    //     if (msg.metric && msg.threshold) {
    //       setAlertEvents((prev) => [msg, ...prev].slice(0, 10));
    //       setCurrentMetrics((prev) => ({
    //         ...prev,
    //         lastAnomalyTime: msg.time || new Date().toISOString(),
    //       }));
    //     }

    //     // If it's just telemetry received confirmation (can be ignored or logged)
    //     if (typeof msg === "string" && msg.includes("Telemetry data received")) {
    //       return;
    //     }

    //     // You can also process raw telemetry echo (optional)
    //     // console.log("WS msg:", msg);
    //   } catch (e) {
    //     console.error("Failed to parse WS message", e);
    //   }
    // };

    ws.onmessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
        console.log("received WS message: ", event.data);
      } catch {
        // Not JSON — could be a plain string message, just log or ignore
        console.log("Received non-JSON WS message:", event.data);
        return;
      }

      // Now process msg as JSON object
      if (msg.metric && msg.threshold) {
        setAlertEvents((prev) => [msg, ...prev].slice(0, 10));
        setCurrentMetrics((prev) => ({
          ...prev,
          lastAnomalyTime: msg.time || new Date().toISOString(),
        }));
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

