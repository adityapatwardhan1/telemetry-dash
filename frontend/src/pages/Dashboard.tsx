import React from "react";
import useTelemetry from "../hooks/useTelemetry"
import Graph from "../components/Graph";
import StatusCard from "../components/StatusCard";
import EventTable from "../components/EventTable";

export default function Dashboard() {
  // 1. Get telemetry data and alerts from your hook
  const { telemetryData, currentMetrics, alertEvents } = useTelemetry();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-4">System Telemetry</h1>

        {/* Graphs for CPU, Memory, Battery, etc */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Graph
            title="CPU Usage"
            data={telemetryData.cpu}
            threshold={80}
            yAxisLabel="%"
          />
          <Graph
            title="Memory Usage"
            data={telemetryData.memory}
            threshold={70}
            yAxisLabel="%"
          />
          {/* Add more Graphs as needed */}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Current Status</h2>
        <div className="flex space-x-6">
          <StatusCard label="Battery" value={`${currentMetrics.battery}%`} />
          <StatusCard label="Temperature" value={`${currentMetrics.temperature}°C`} />
          <StatusCard label="Speed" value={`${currentMetrics.speed} km/h`} />
          <StatusCard label="Last Anomaly" value={currentMetrics.lastAnomalyTime} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
        <EventTable events={alertEvents} />
      </section>
    </div>
  );
}
