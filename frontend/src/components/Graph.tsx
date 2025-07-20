import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

type MetricPoint = {
  timestamp: number;
  value: number;
};

interface GraphProps {
  title: string;
  data: MetricPoint[];
  threshold?: number;
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
  const formattedData = data.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString(),
    value: point.value,
  }));

  return (
    <div className="p-4 bg-white rounded-2xl shadow w-full">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formattedData}>
          <XAxis dataKey="time" hide />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v: any) => `${v}${yAxisLabel}`}
          />
          <Tooltip formatter={(value: any) => `${value}${yAxisLabel}`} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
          {threshold !== undefined && (
            <ReferenceLine
              y={threshold}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{
                value: `Threshold: ${threshold}${yAxisLabel}`,
                position: "top",
                fill: "#ef4444",
                fontSize: 12,
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
