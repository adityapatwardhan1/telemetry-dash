import React from "react";

type Threshold = {
  metric: string;
  min: number;
  max: number;
};

type Props = {
  thresholds: Threshold[];
  onEdit: (metric: string) => void;
  onDelete: (metric: string) => void;
};

export default function ThresholdTable({ thresholds, onEdit, onDelete }: Props) {
  return (
    <table className="w-full table-auto bg-white rounded shadow">
      <thead>
        <tr>
          <th className="border px-3 py-2">Metric</th>
          <th className="border px-3 py-2">Min</th>
          <th className="border px-3 py-2">Max</th>
          <th className="border px-3 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {thresholds.map(({ metric, min, max }) => (
          <tr key={metric}>
            <td className="border px-3 py-2">{metric.toUpperCase()}</td>
            <td className="border px-3 py-2">{min}</td>
            <td className="border px-3 py-2">{max}</td>
            <td className="border px-3 py-2 space-x-2">
              <button
                className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                onClick={() => onEdit(metric)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                onClick={() => onDelete(metric)}
              >
                Delete
              </button>
            </td>
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
