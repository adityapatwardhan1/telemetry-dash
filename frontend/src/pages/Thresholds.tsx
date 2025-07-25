// import React, { useEffect, useState } from "react";
// import ThresholdForm from "../components/ThresholdForm";
// import ThresholdTable from "../components/ThresholdTable";
// import Header from "../components/Header";
// import type { Threshold } from "../types/Threshold";

// export default function Thresholds() {
//   const deviceId = 1; // Replace with dynamic ID as needed

//   const [thresholds, setThresholds] = useState<Threshold[]>([]);
//   const [editingThreshold, setEditingThreshold] = useState<Threshold | null>(null);

//   const fetchThresholds = async () => {
//     try {
//       // Backend expects device_id in path, otherwise 404/405 errors
//       const res = await fetch(`http://localhost:8000/api/thresholds/${deviceId}`);

//       const contentType = res.headers.get("Content-Type") || "";
//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed to fetch thresholds: ${res.status} - ${errText}`);
//       }

//       if (!contentType.includes("application/json")) {
//         const raw = await res.text();
//         throw new Error(`Unexpected response (not JSON): ${raw}`);
//       }

//       const data = await res.json();
//       setThresholds(data);
//     } catch (err) {
//       console.error("Failed to fetch thresholds:", err);
//     }
//   };

//   useEffect(() => {
//     fetchThresholds();
//   }, []);

//   const handleSubmit = async (newThreshold: Threshold) => {
//     const body = {
//       device_id: deviceId,
//       metric: newThreshold.metric,
//       min_value: newThreshold.min,
//       max_value: newThreshold.max,
//     };

//     try {
//       const res = await fetch("http://localhost:8000/api/thresholds", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (!res.ok) {
//         const msg = await res.text();
//         throw new Error(`Failed to save threshold: ${msg}`);
//       }

//       const saved = await res.json();
//       setThresholds((prev) => {
//         const exists = prev.find((t) => t.metric === saved.metric);
//         console.log("exists ="+JSON.stringify(exists));
//         return exists
//           ? prev.map((t) => (t.metric === saved.metric ? saved : t))
//           : [...prev, saved];
//       });
//       setEditingThreshold(null);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEdit = (metric: string) => {
//     const t = thresholds.find((t) => t.metric === metric);
//     if (t) setEditingThreshold(t);
//   };

//   const handleDelete = (metric: string) => {
//     setThresholds((prev) => prev.filter((t) => t.metric !== metric));
//     if (editingThreshold?.metric === metric) setEditingThreshold(null);
//     // Optionally: send DELETE request to backend here if implemented
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4 space-y-6 text-white">
//       <h1 className="text-2xl font-bold">Alert Thresholds</h1>
//       <ThresholdForm initialThreshold={editingThreshold} deviceId={String(deviceId)} onSubmit={handleSubmit} />
//       <ThresholdTable thresholds={thresholds} onEdit={handleEdit} onDelete={handleDelete} />
//     </div>
//   );
// }


// Thresholds.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ThresholdForm from "../components/ThresholdForm";
import ThresholdTable from "../components/ThresholdTable";
import Header from "../components/Header";
import type { Threshold } from "../types/Threshold";

export default function Thresholds() {
  const [ deviceId, setDeviceId ] = useState(1);
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [editingThreshold, setEditingThreshold] = useState<Threshold | null>(null);

  const fetchThresholds = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/thresholds/${deviceId}`);
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
    if (deviceId) fetchThresholds();
  }, [deviceId]);

  const handleSubmit = async (newThreshold: Threshold) => {
    const body = {
      device_id: Number(deviceId),
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
        const exists = prev.find((t) => t.metric === saved.metric);
        return exists
          ? prev.map((t) => (t.metric === saved.metric ? saved : t))
          : [...prev, saved];
      });
      setEditingThreshold(null);
    } catch (err) {
      console.error("Failed to save threshold:", err);
    }
  };

  const handleEdit = (metric: string) => {
    const t = thresholds.find((t) => t.metric === metric);
    if (t) setEditingThreshold(t);
  };

  const handleDelete = (metric: string) => {
    setThresholds((prev) => prev.filter((t) => t.metric !== metric));
    if (editingThreshold?.metric === metric) setEditingThreshold(null);
    // Optionally send DELETE request
  };

  if (!deviceId) return <p className="text-red-500">Missing device ID</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 text-white">
      <h1 className="text-2xl font-bold">Alert Thresholds</h1>
      <ThresholdForm
        initialThreshold={editingThreshold}
        // deviceId={deviceId}
        onSubmit={handleSubmit}
      />
      <ThresholdTable
        thresholds={thresholds}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
