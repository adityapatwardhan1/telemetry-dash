import { useEffect, useState, useRef } from "react";

type MetricPoint = {
  timestamp: number;
  value: number;
};

type MetricData = MetricPoint[];

type CurrentMetrics = {
  cpu: number;
  memory: number;
  battery: number;
  temperature: number;
  speed: number;
  lastAnomalyTime: string;
};

export type AlertEvent = {
  time: string;
  metric: string;
  value: number;
  threshold: string; // e.g. "35–75°C"
};

export default function useTelemetry() {
  const [telemetryData, setTelemetryData] = useState<{
    cpu: MetricData;
    memory: MetricData;
    battery: MetricData;
    temperature: MetricData;
  }>({
    cpu: [],
    memory: [],
    battery: [],
    temperature: [],
  });

  const [currentMetrics, setCurrentMetrics] = useState<CurrentMetrics>({
    cpu: 0,
    memory: 0,
    battery: 0,
    temperature: 0,
    speed: 0,
    lastAnomalyTime: "-",
  });

  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Threshold ranges
  const cpuMin = 0;
  const cpuMax = 85;
  const batteryMin = 90;
  const batteryMax = 100;
  const tempMin = 35;
  const tempMax = 75;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now();

      const cpuVal = Math.random() * 100;
      const memoryVal = Math.random() * 100;
      const batteryVal = 85 + Math.random() * 20; // 85–105
      const tempVal = 30 + Math.random() * 50;     // 30–80

      setTelemetryData((prev) => ({
        cpu: [...prev.cpu.slice(-49), { timestamp: now, value: cpuVal }],
        memory: [...prev.memory.slice(-49), { timestamp: now, value: memoryVal }],
        battery: [...prev.battery.slice(-49), { timestamp: now, value: batteryVal }],
        temperature: [...prev.temperature.slice(-49), { timestamp: now, value: tempVal }],
      }));

      setCurrentMetrics({
        cpu: cpuVal,
        memory: memoryVal,
        battery: batteryVal,
        temperature: tempVal,
        speed: Math.random() * 80,
        lastAnomalyTime:
          Math.random() > 0.95 ? new Date().toLocaleTimeString() : currentMetrics.lastAnomalyTime,
      });

      const alerts: AlertEvent[] = [];

      if (cpuVal < cpuMin || cpuVal > cpuMax) {
        alerts.push({
          time: new Date().toLocaleTimeString(),
          metric: "CPU",
          value: cpuVal,
          threshold: `${cpuMin}–${cpuMax}%`,
        });
      }

      if (batteryVal < batteryMin || batteryVal > batteryMax) {
        alerts.push({
          time: new Date().toLocaleTimeString(),
          metric: "Battery",
          value: batteryVal,
          threshold: `${batteryMin}–${batteryMax}%`,
        });
      }

      if (tempVal < tempMin || tempVal > tempMax) {
        alerts.push({
          time: new Date().toLocaleTimeString(),
          metric: "Temperature",
          value: tempVal,
          threshold: `${tempMin}–${tempMax}°C`,
        });
      }

      if (alerts.length > 0) {
        setAlertEvents((prev) => [...alerts, ...prev].slice(0, 10)); // Keep top 10
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { telemetryData, currentMetrics, alertEvents };
}
