import React from "react";
import useTelemetry from "../hooks/useTelemetry";
import Graph from "../components/Graph";
import StatusCard from "../components/StatusCard";
import EventTable from "../components/EventTable";

export default function Dashboard() {
  const { telemetryData, currentMetrics, alertEvents } = useTelemetry();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-4">System Telemetry</h1>

        {/* Graphs for CPU Usage, Battery, and Temperature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Graph
            title="CPU Usage"
            data={telemetryData.cpu}
            threshold={{ min: 0, max: 85 }}
            yAxisLabel="%"
          />
          <Graph
            title="Battery"
            data={telemetryData.battery}
            threshold={{ min: 90, max: 100 }}
            yAxisLabel="%"
          />
          <Graph
            title="Temperature"
            data={telemetryData.temperature}
            threshold={{ min: 35, max: 75 }}
            yAxisLabel="°C"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Current Status</h2>
        <div className="flex space-x-6">
          <StatusCard label="Battery" value={`${currentMetrics.battery.toFixed(1)}%`} />
          <StatusCard label="Temperature" value={`${currentMetrics.temperature.toFixed(1)}°C`} />
          <StatusCard label="Speed" value={`${currentMetrics.speed.toFixed(1)} km/h`} />
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
