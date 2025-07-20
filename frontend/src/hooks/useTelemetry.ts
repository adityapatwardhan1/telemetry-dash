import { useEffect, useState, useRef } from "react";

type MetricPoint = { timestamp: number; value: number; };
type MetricData = MetricPoint[];

type CurrentMetrics = {
  cpu: number;
  battery: number;
  temperature: number;
  speed: number;
  lastAnomalyTime: string;
};

export type AlertEvent = {
  time: string;
  metric: string;
  value: number;
  threshold: string;
};

export default function useTelemetry() {
  const [telemetryData, setTelemetryData] = useState<{
    cpu: MetricData;
    battery: MetricData;
    temperature: MetricData;
  }>({ cpu: [], battery: [], temperature: [] });

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
    wsRef.current = new WebSocket("ws://localhost:8000/ws/telemetry");

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        // Expect backend to send structured message like:
        // { telemetryData: {...}, currentMetrics: {...}, alertEvents: [...] }
        setTelemetryData(message.telemetryData);
        setCurrentMetrics(message.currentMetrics);
        setAlertEvents(message.alertEvents);
      } catch (e) {
        console.error("Invalid message", e);
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket closed");
    };

    wsRef.current.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return { telemetryData, currentMetrics, alertEvents };
}
