import React, { useState } from 'react';

export default function ThresholdSettingsPanel() {
  const [thresholds, setThresholds] = useState([
    { metric: 'battery', min: 20, max: 90 },
    { metric: 'cpu_usage', min: 0, max: 80 },
    { metric: 'temperature', min: 10, max: 50 },
  ]);

  const [selectedMetric, setSelectedMetric] = useState('');
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(100);

  const handleAddThreshold = () => {
    if (!selectedMetric || isNaN(minValue) || isNaN(maxValue)) return;

    setThresholds((prev) => {
      const filtered = prev.filter((t) => t.metric !== selectedMetric);
      return [...filtered, { metric: selectedMetric, min: minValue, max: maxValue }];
    });

    setSelectedMetric('');
    setMinValue(0);
    setMaxValue(100);
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow w-full max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Set Alert Thresholds</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <select
          className="border rounded px-2 py-1"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
        >
          <option value="">Select metric</option>
          <option value="battery">Battery</option>
          <option value="cpu_usage">CPU Usage</option>
          <option value="temperature">Temperature</option>
        </select>

        <input
          className="border rounded px-2 py-1 w-24"
          type="number"
          placeholder="Min"
          value={minValue}
          onChange={(e) => setMinValue(parseFloat(e.target.value))}
        />
        <input
          className="border rounded px-2 py-1 w-24"
          type="number"
          placeholder="Max"
          value={maxValue}
          onChange={(e) => setMaxValue(parseFloat(e.target.value))}
        />

        <button
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          onClick={handleAddThreshold}
        >
          Save
        </button>
      </div>

      <table className="w-full table-auto border-t">
        <thead>
          <tr className="border-b">
            <th className="text-left px-2 py-1">Metric</th>
            <th className="text-left px-2 py-1">Min (%)</th>
            <th className="text-left px-2 py-1">Max (%)</th>
          </tr>
        </thead>
        <tbody>
          {thresholds.map(({ metric, min, max }) => (
            <tr key={metric} className="border-b">
              <td className="px-2 py-1">{metric}</td>
              <td className="px-2 py-1">{min}</td>
              <td className="px-2 py-1">{max}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
