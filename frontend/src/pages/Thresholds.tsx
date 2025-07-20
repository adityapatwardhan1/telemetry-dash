import React, { useState } from "react";
import ThresholdForm from "../components/ThresholdForm"
import ThresholdTable from "../components/ThresholdTable"

type Threshold = {
  metric: string;
  min: number;
  max: number;
};

export default function Thresholds() {
  const [thresholds, setThresholds] = useState<Threshold[]>([
    { metric: "cpu", min: 0, max: 85 },
    { metric: "battery", min: 90, max: 100 },
    { metric: "temperature", min: 35, max: 75 },
  ]);

  const [editingThreshold, setEditingThreshold] = useState<Threshold | null>(null);

  const handleSubmit = (newThreshold: Threshold) => {
    setThresholds((prev) => {
      const exists = prev.find((t) => t.metric === newThreshold.metric);
      if (exists) {
        // update existing
        return prev.map((t) =>
          t.metric === newThreshold.metric ? newThreshold : t
        );
      }
      // add new
      return [...prev, newThreshold];
    });
    setEditingThreshold(null);
  };

  const handleEdit = (metric: string) => {
    const t = thresholds.find((t) => t.metric === metric);
    if (t) setEditingThreshold(t);
  };

  const handleDelete = (metric: string) => {
    setThresholds((prev) => prev.filter((t) => t.metric !== metric));
    if (editingThreshold?.metric === metric) setEditingThreshold(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Alert Thresholds</h1>
      <ThresholdForm initialThreshold={editingThreshold} onSubmit={handleSubmit} />
      <ThresholdTable thresholds={thresholds} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
