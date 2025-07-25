import React from "react";
import type { Threshold } from "../types/Threshold";

type Props = {
  thresholds: Threshold[];
};

export default function ThresholdTable({ thresholds }: Props) {
  return (
    <table className="w-full table-auto bg-white rounded shadow">
      <thead>
        <tr>
          <th className="border px-3 py-2">Device ID</th>
          <th className="border px-3 py-2">Metric</th>
          <th className="border px-3 py-2">Min</th>
          <th className="border px-3 py-2">Max</th>
        </tr>
      </thead>
      <tbody>
        {thresholds.map(({ id, metric, min, max }) => (
          <tr key={`${id}-${metric}`}>
            <td className="border px-3 py-2">{id}</td>
            <td className="border px-3 py-2">{metric.toUpperCase()}</td>
            <td className="border px-3 py-2">{min}</td>
            <td className="border px-3 py-2">{max}</td>
          </tr>
        ))}
        {thresholds.length === 0 && (
          <tr>
            <td colSpan={4} className="text-center py-4 text-gray-500">
              No thresholds set.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
