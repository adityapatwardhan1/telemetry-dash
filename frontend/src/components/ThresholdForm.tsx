import React, { useState, useEffect } from "react";

type Threshold = {
  metric: string;
  min: number;
  max: number;
};

type Props = {
  initialThreshold?: Threshold | null;
  onSubmit: (threshold: Threshold) => void;
};

const METRIC_OPTIONS = ["cpu", "battery", "temperature"];

export default function ThresholdForm({ initialThreshold, onSubmit }: Props) {
  const [metric, setMetric] = useState(initialThreshold?.metric || "");
  const [min, setMin] = useState(initialThreshold?.min ?? 0);
  const [max, setMax] = useState(initialThreshold?.max ?? 0);

  useEffect(() => {
    if (initialThreshold) {
      setMetric(initialThreshold.metric);
      setMin(initialThreshold.min);
      setMax(initialThreshold.max);
    } else {
      setMetric("");
      setMin(0);
      setMax(0);
    }
  }, [initialThreshold]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metric) return alert("Select a metric");
    if (min > max) return alert("Min cannot be greater than Max");
    onSubmit({ metric, min, max });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
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
          onChange={(e) => setMin(parseFloat(e.target.value))}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Max Value</label>
        <input
          type="number"
          value={max}
          onChange={(e) => setMax(parseFloat(e.target.value))}
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
