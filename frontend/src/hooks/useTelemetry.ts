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
	threshold: number;
};

export default function useTelemetry() {
	// Time-series data for graphs
	const [telemetryData, setTelemetryData] = useState<{
		cpu: MetricData;
		memory: MetricData;
		battery: MetricData;
	}>({
		cpu: [],
		memory: [],
		battery: [],
	});

	// Current values for cards
	const [currentMetrics, setCurrentMetrics] = useState<CurrentMetrics>({
		cpu: 0,
		memory: 0,
		battery: 0,
		temperature: 0,
		speed: 0,
		lastAnomalyTime: "-",
	});

	// Recent alert events
	const [alertEvents, setAlertEvents] = useState<AlertEvent[]>([]);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		// Simulate data every second (replace with WebSocket if available)
		intervalRef.current = setInterval(() => {
			const now = Date.now();

			const cpuVal = Math.random() * 100;
			const memoryVal = Math.random() * 100;
			const batteryVal = 90 + Math.random() * 10;

			setTelemetryData((prev) => ({
				cpu: [...prev.cpu.slice(-49), { timestamp: now, value: cpuVal }],
				memory: [...prev.memory.slice(-49), { timestamp: now, value: memoryVal }],
				battery: [...prev.battery.slice(-49), { timestamp: now, value: batteryVal }],
			}));

			setCurrentMetrics({
				cpu: cpuVal,
				memory: memoryVal,
				battery: batteryVal,
				temperature: 35 + Math.random() * 5,
				speed: Math.random() * 80,
				lastAnomalyTime: Math.random() > 0.95 ? new Date().toLocaleTimeString() : currentMetrics.lastAnomalyTime,
			});

			// Fake alert condition
			if (cpuVal > 85 || memoryVal > 90) {
				const newEvent: AlertEvent = {
				time: new Date().toLocaleTimeString(),
				metric: cpuVal > 85 ? "CPU" : "Memory",
				value: cpuVal > 85 ? cpuVal : memoryVal,
				threshold: cpuVal > 85 ? 85 : 90,
				};
				setAlertEvents((prev) => [newEvent, ...prev.slice(0, 9)]); // Keep only 10 recent
			}
		}, 1000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	return { telemetryData, currentMetrics, alertEvents };
}
