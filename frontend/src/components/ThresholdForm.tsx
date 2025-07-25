import React, { useState, useEffect } from "react";
import type { Threshold } from "../types/Threshold";

type Props = {
  initialThreshold?: Threshold | null;
  onSubmit: (threshold: Threshold) => void;
};

const METRIC_OPTIONS = ["cpu_usage", "battery", "temperature"];

export default function ThresholdForm({ initialThreshold, onSubmit }: Props) {
  const [deviceId, setDeviceId] = useState<number>(initialThreshold?.id ?? 1);
  const [metric, setMetric] = useState<string>(initialThreshold?.metric ?? "");
  const [min, setMin] = useState<string>(initialThreshold?.min?.toString() ?? "");
  const [max, setMax] = useState<string>(initialThreshold?.max?.toString() ?? "");

  useEffect(() => {
    setDeviceId(initialThreshold?.id ?? 1);
    setMetric(initialThreshold?.metric ?? "");
    setMin(initialThreshold?.min?.toString() ?? "");
    setMax(initialThreshold?.max?.toString() ?? "");
  }, [initialThreshold]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedMin = parseFloat(min);
    const parsedMax = parseFloat(max);

    if (!metric) return alert("Select a metric");
    if (isNaN(parsedMin) || isNaN(parsedMax)) return alert("Min/Max must be valid numbers");
    if (parsedMin > parsedMax) return alert("Min cannot be greater than Max");

    onSubmit({
      id: deviceId,
      metric,
      min: parsedMin,
      max: parsedMax,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
      <div>
        <label className="block mb-1 font-semibold">Device ID</label>
        <input
          type="number"
          value={deviceId}
          onChange={(e) => setDeviceId(Number(e.target.value))}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Metric</label>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          disabled={!!initialThreshold}
        >
          <option value="">-- Select Metric --</option>
          {METRIC_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Min Value</label>
        <input
          type="number"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Max Value</label>
        <input
          type="number"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {initialThreshold ? "Update Threshold" : "Add Threshold"}
      </button>
    </form>
  );
}
