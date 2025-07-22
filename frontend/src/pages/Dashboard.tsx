import React, { useState } from "react";
import Graph from "../components/Graph";
import StatusCard from "../components/StatusCard";
import EventTable from "../components/EventTable";
import useTelemetry from "../hooks/usePolling";

export default function Dashboard() {
  const { telemetryData, alertEventsByDevice, currentMetricsByDevice } = useTelemetry();

  // Extract device IDs from telemetryData (keys of any metric)
  const deviceIds = Object.keys(telemetryData.cpu_usage);

  const [selectedDeviceId, setSelectedDeviceId] = useState(deviceIds[0] || "");

  // If you want multi-line graphs for multiple devices, keep selectedDeviceId[] array
  // or for simplicity, start with single selection

  if (deviceIds.length === 0) {
    return <div>Loading telemetry data...</div>;
  }

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
          threshold={{ min: 0, max: 85 }}
          yAxisLabel="%"
        />
        <Graph
          title="Battery"
          data={telemetryData.battery[selectedDeviceId] || []}
          threshold={{ min: 90, max: 100 }}
          yAxisLabel="%"
        />
        <Graph
          title="Temperature"
          data={telemetryData.temperature[selectedDeviceId] || []}
          threshold={{ min: 35, max: 75 }}
          yAxisLabel="°C"
        />
      </div>

      {/* Add alert table filtered by device if you want */}
      <EventTable events={alertEventsByDevice[selectedDeviceId] || []} />
    </div>
  );
}

