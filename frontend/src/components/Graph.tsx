import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

type MetricPoint = {
  timestamp: number;
  value: number;
};

interface ThresholdRange {
  min: number;
  max: number;
}

interface GraphProps {
  title: string;
  data: MetricPoint[];
  threshold?: ThresholdRange;
  yAxisLabel?: string;
  color?: string;
}

export default function Graph({
  title,
  data,
  threshold,
  yAxisLabel = "%",
  color = "#3b82f6",
}: GraphProps) {
  const MAX_WINDOW = 150 * 1000; // 150 seconds

  const domain =
    data.length > 0
      ? [data[0].timestamp, data[data.length - 1].timestamp]
      : [0, MAX_WINDOW];

  const windowSize = 150 * 1000; // 150 seconds
  const maxTimestamp = data.length > 0 ? data[data.length - 1].timestamp : Date.now();
  const minTimestamp = maxTimestamp - windowSize;

  return (
    <div className="p-4 bg-white rounded-2xl shadow w-full">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>       
          <XAxis
            dataKey="timestamp"
            domain={[minTimestamp, maxTimestamp]}
            type="number"
            tickFormatter={(time) =>
              new Date(time).toLocaleTimeString(undefined, {
                minute: "2-digit",
                second: "2-digit",
              })
            }
            interval="preserveStartEnd"
            allowDataOverflow={true}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}${yAxisLabel}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            labelFormatter={(time) =>
              new Date(time).toLocaleTimeString(undefined, {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            }
            formatter={(value) => `${value}${yAxisLabel}`}
          />
          
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />

          {threshold && (
            <>
              <ReferenceLine
                y={threshold.min}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: `Min: ${threshold.min}${yAxisLabel}`,
                  position: "insideTopLeft",
                  fill: "#ef4444",
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                y={threshold.max}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: `Max: ${threshold.max}${yAxisLabel}`,
                  position: "insideBottomLeft",
                  fill: "#ef4444",
                  fontSize: 12,
                }}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
