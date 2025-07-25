// import React, { useState } from "react";
// import Graph from "../components/Graph";
// import StatusCard from "../components/StatusCard";
// import EventTable from "../components/EventTable";
// import useTelemetry from "../hooks/usePolling";
// import Header from "../components/Header";

// export default function Dashboard() {
//   const { telemetryData, alertEventsByDevice, currentMetricsByDevice } = useTelemetry();

//   // Extract device IDs from telemetryData (keys of any metric)
//   const deviceIds = Object.keys(telemetryData.cpu_usage);

//   const [selectedDeviceId, setSelectedDeviceId] = useState(deviceIds[0] || "");

//   if (deviceIds.length === 0) {
//     return <div>Loading telemetry data...</div>;
//   }

//   return (
//     <div>
//       {/* <Header /> */}
//       <h1>System Telemetry</h1>

//       <label htmlFor="device-select">Select Device:</label>
//       <select
//         id="device-select"
//         value={selectedDeviceId}
//         onChange={(e) => setSelectedDeviceId(e.target.value)}
//       >
//         {deviceIds.map((id) => (
//           <option key={id} value={id}>
//             Device {id}
//           </option>
//         ))}
//       </select>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//         <Graph
//           title="CPU Usage"
//           data={telemetryData.cpu_usage[selectedDeviceId] || []}
//           threshold={{ min: 0, max: 85 }}
//           yAxisLabel="%"
//         />
//         <Graph
//           title="Battery"
//           data={telemetryData.battery[selectedDeviceId] || []}
//           threshold={{ min: 90, max: 100 }}
//           yAxisLabel="%"
//         />
//         <Graph
//           title="Temperature"
//           data={telemetryData.temperature[selectedDeviceId] || []}
//           threshold={{ min: 35, max: 75 }}
//           yAxisLabel="°C"
//         />
//       </div>

//       {/* Add alert table filtered by device if you want */}
//       <EventTable events={alertEventsByDevice[selectedDeviceId] || []} />
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import Graph from "../components/Graph";
import StatusCard from "../components/StatusCard";
import EventTable from "../components/EventTable";
import useTelemetry from "../hooks/usePolling";
import Header from "../components/Header";

type ThresholdMap = {
  [deviceId: string]: {
    [metric: string]: {
      min: number;
      max: number;
    };
  };
};

export default function Dashboard() {
  const { telemetryData, alertEventsByDevice, currentMetricsByDevice } = useTelemetry();
  const deviceIds = Object.keys(telemetryData.cpu_usage);
  const [selectedDeviceId, setSelectedDeviceId] = useState(deviceIds[0] || "");
  const [thresholds, setThresholds] = useState<ThresholdMap>({});

  // Fetch thresholds once
  useEffect(() => {
    fetch("http://localhost:8000/api/thresholds")
      .then((res) => res.json())
      .then((data) => setThresholds(data))
      .catch((err) => console.error("Failed to load thresholds", err));
  }, []);

  if (deviceIds.length === 0) {
    return <div>Loading telemetry data...</div>;
  }

  const getThreshold = (metric: string) => {
    return thresholds[selectedDeviceId]?.[metric] || { min: 0, max: 100 };
  };

  return (
    <div>
      <h1>System Telemetry</h1>

      <label htmlFor="device-select">Select Device:</label>
      <select
        id="device-select"
        value={selectedDeviceId}
        onChange={(e) => setSelectedDeviceId(e.target.value)}
      >
        {deviceIds.map((id) => (
          <option key={id} value={id}>
            Device {id}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Graph
          title="CPU Usage"
          data={telemetryData.cpu_usage[selectedDeviceId] || []}
          threshold={getThreshold("cpu_usage")}
          yAxisLabel="%"
        />
        <Graph
          title="Battery"
          data={telemetryData.battery[selectedDeviceId] || []}
          threshold={getThreshold("battery")}
          yAxisLabel="%"
        />
        <Graph
          title="Temperature"
          data={telemetryData.temperature[selectedDeviceId] || []}
          threshold={getThreshold("temperature")}
          yAxisLabel="°C"
        />
      </div>

      <EventTable events={alertEventsByDevice[selectedDeviceId] || []} />
    </div>
  );
}
