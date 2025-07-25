import React, { useEffect, useState } from "react";
import ThresholdForm from "../components/ThresholdForm";
import ThresholdTable from "../components/ThresholdTable";
import type { Threshold } from "../types/Threshold";

export default function Thresholds() {
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [editingThreshold, setEditingThreshold] = useState<Threshold | null>(null);

  const fetchThresholds = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/thresholds`);
      const contentType = res.headers.get("Content-Type") || "";
      if (!res.ok) throw new Error(await res.text());
      if (!contentType.includes("application/json"))
        throw new Error("Expected JSON response");

      const data = await res.json();
      setThresholds(data);
    } catch (err) {
      console.error("Failed to fetch thresholds:", err);
    }
  };

  useEffect(() => {
    fetchThresholds();
  }, []);

  const handleSubmit = async (newThreshold: Threshold) => {
    const body = {
      device_id: newThreshold.id,
      metric: newThreshold.metric,
      min_value: newThreshold.min,
      max_value: newThreshold.max,
    };

    try {
      const res = await fetch("http://localhost:8000/api/thresholds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      const saved = await res.json();
      setThresholds((prev) => {
        const exists = prev.find(
          (t) =>
            t.metric === saved.metric &&
            t.id === saved.device_id
        );
        return exists
          ? prev.map((t) =>
              t.metric === saved.metric && t.id === saved.device_id
                ? saved
                : t
            )
          : [...prev, saved];
      });
      setEditingThreshold(null);
    } catch (err) {
      console.error("Failed to save threshold:", err);
    }
  };

  const handleEdit = (threshold: Threshold) => {
    setEditingThreshold(threshold);
  };

  const handleDelete = (threshold: Threshold) => {
    setThresholds((prev) =>
      prev.filter(
        (t) =>
          !(
            t.metric === threshold.metric &&
            t.id === threshold.id
          )
      )
    );
    if (
      editingThreshold?.metric === threshold.metric &&
      editingThreshold?.id === threshold.id
    ) {
      setEditingThreshold(null);
    }
    // TODO: Optionally send DELETE request here
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 text-white">
      <h1 className="text-2xl font-bold">Alert Thresholds</h1>
      <ThresholdForm
        initialThreshold={editingThreshold}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
