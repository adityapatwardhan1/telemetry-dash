// // // import React from "react";
// // // import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

// // // type MetricPoint = {
// // //   timestamp: number;
// // //   value: number;
// // // };

// // // interface ThresholdRange {
// // //   min: number;
// // //   max: number;
// // // }

// // // interface GraphProps {
// // //   title: string;
// // //   data: MetricPoint[];
// // //   threshold?: ThresholdRange;
// // //   yAxisLabel?: string;
// // //   color?: string;
// // // }

// // // const Graph = React.memo(function Graph({
// // //   title,
// // //   data,
// // //   threshold,
// // //   yAxisLabel = "%",
// // //   color = "#3b82f6",
// // // }: GraphProps) {
// // //   // Format timestamps to human-readable strings
// // //   const formattedData = React.useMemo(() => 
// // //     data.map((point) => ({
// // //       time: new Date(point.timestamp).toLocaleTimeString(),
// // //       value: point.value,
// // //     })),
// // //   [data]);

// // //   return (
// // //     <div className="p-4 bg-white rounded-2xl shadow w-full">
// // //       <h2 className="text-lg font-semibold mb-2">{title}</h2>
// // //       <ResponsiveContainer width="100%" height={200} key={formattedData.length}>
// // //         <LineChart data={formattedData}>
// // //           <XAxis dataKey="time" hide />
// // //           <YAxis
// // //             domain={[0, 100]}
// // //             tickFormatter={(v: number) => `${v}${yAxisLabel}`}
// // //           />
// // //           <Tooltip formatter={(value: number) => `${value}${yAxisLabel}`} />
// // //           <Line
// // //             type="monotone"
// // //             dataKey="value"
// // //             stroke={color}
// // //             strokeWidth={2}
// // //             dot={false}
// // //             isAnimationActive={true}
// // //             animationDuration={500}
// // //             animationEasing="ease-in-out"
// // //           />
// // //           {threshold && (
// // //             <>
// // //               <ReferenceLine
// // //                 y={threshold.min}
// // //                 stroke="#ef4444"
// // //                 strokeDasharray="4 4"
// // //                 label={{
// // //                   value: `Min: ${threshold.min}${yAxisLabel}`,
// // //                   position: "insideTopLeft",
// // //                   fill: "#ef4444",
// // //                   fontSize: 12,
// // //                 }}
// // //               />
// // //               <ReferenceLine
// // //                 y={threshold.max}
// // //                 stroke="#ef4444"
// // //                 strokeDasharray="4 4"
// // //                 label={{
// // //                   value: `Max: ${threshold.max}${yAxisLabel}`,
// // //                   position: "insideBottomLeft",
// // //                   fill: "#ef4444",
// // //                   fontSize: 12,
// // //                 }}
// // //               />
// // //             </>
// // //           )}
// // //         </LineChart>
// // //       </ResponsiveContainer>
// // //     </div>
// // //   );
// // // });

// // // export default Graph;


// // import React from "react";
// // import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

// // type MetricPoint = {
// //   timestamp: number;
// //   value: number;
// // };

// // interface ThresholdRange {
// //   min: number;
// //   max: number;
// // }

// // interface GraphProps {
// //   title: string;
// //   data: MetricPoint[];
// //   threshold?: ThresholdRange;
// //   yAxisLabel?: string;
// //   color?: string;
// // }

// // const Graph = React.memo(function Graph({
// //   title,
// //   data,
// //   threshold,
// //   yAxisLabel = "%",
// //   color = "#3b82f6",
// // }: GraphProps) {
// //   // Format timestamps to human-readable strings
// //   const formattedData = React.useMemo(() => 
// //     data.map((point) => ({
// //       time: new Date(point.timestamp).toLocaleTimeString(),
// //       value: point.value,
// //     })),
// //   [data]);

// //   return (
// //     <div className="p-4 bg-white rounded-2xl shadow w-full">
// //       <h2 className="text-lg font-semibold mb-2">{title}</h2>
// //       <ResponsiveContainer width="100%" height={200} key={formattedData.length}>
// //         <LineChart data={formattedData}>
// //           <XAxis dataKey="time" hide />
// //           <YAxis
// //             domain={[0, 100]}
// //             tickFormatter={(v: number) => `${v}${yAxisLabel}`}
// //           />
// //           <Tooltip formatter={(value: number) => `${value}${yAxisLabel}`} />
// //           <Line
// //             type="monotone"
// //             dataKey="value"
// //             stroke={color}
// //             strokeWidth={2}
// //             dot={false}
// //             isAnimationActive={true}
// //             animationDuration={500}
// //             animationEasing="ease-in-out"
// //           />
// //           {threshold && (
// //             <>
// //               <ReferenceLine
// //                 y={threshold.min}
// //                 stroke="#ef4444"
// //                 strokeDasharray="4 4"
// //                 label={{
// //                   value: `Min: ${threshold.min}${yAxisLabel}`,
// //                   position: "insideTopLeft",
// //                   fill: "#ef4444",
// //                   fontSize: 12,
// //                 }}
// //               />
// //               <ReferenceLine
// //                 y={threshold.max}
// //                 stroke="#ef4444"
// //                 strokeDasharray="4 4"
// //                 label={{
// //                   value: `Max: ${threshold.max}${yAxisLabel}`,
// //                   position: "insideBottomLeft",
// //                   fill: "#ef4444",
// //                   fontSize: 12,
// //                 }}
// //               />
// //             </>
// //           )}
// //         </LineChart>
// //       </ResponsiveContainer>
// //     </div>
// //   );
// // });

// // export default Graph;

// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// type MetricPoint = {
//   timestamp: number; // Keep numeric for smooth axis scaling
//   value: number;
// };

// interface GraphProps {
//   title: string;
//   data: MetricPoint[];
//   yAxisLabel?: string;
//   color?: string;
// }

// export default function Graph({
//   title,
//   data,
//   yAxisLabel = "%",
//   color = "#3b82f6",
// }: GraphProps) {
//   // No formatting of timestamp to string here — keep number for axis scaling
//   const formattedData = React.useMemo(() => data, [data]);

//   // Define x-axis domain: last N seconds (e.g., last 50 * 1000 ms)
//   const MAX_WINDOW = 50 * 1000; // 50 seconds window

//   // If data empty, use default domain
//   const domain =
//     data.length > 0
//       ? [data[0].timestamp, data[data.length - 1].timestamp]
//       : [0, MAX_WINDOW];

//   return (
//     <div className="p-4 bg-white rounded-2xl shadow w-full">
//       <h2 className="text-lg font-semibold mb-2">{title}</h2>
//       <ResponsiveContainer width="100%" height={200}>
//         <LineChart data={formattedData}>
//           <XAxis
//             dataKey="timestamp"
//             domain={domain}
//             type="number"
//             tickFormatter={(time) =>
//               new Date(time).toLocaleTimeString(undefined, {
//                 minute: "2-digit",
//                 second: "2-digit",
//               })
//             }
//             interval="preserveStartEnd"
//             allowDataOverflow={true}
//             tick={{ fontSize: 12 }}
//           />
//           <YAxis
//             domain={[0, 100]}
//             tickFormatter={(v) => `${v}${yAxisLabel}`}
//             tick={{ fontSize: 12 }}
//           />
//           <Tooltip
//             labelFormatter={(time) =>
//               new Date(time).toLocaleTimeString(undefined, {
//                 hour12: false,
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 second: "2-digit",
//               })
//             }
//             formatter={(value) => `${value}${yAxisLabel}`}
//           />
//           <Line
//             type="monotone"
//             dataKey="value"
//             stroke={color}
//             strokeWidth={2}
//             dot={false}
//             isAnimationActive={true}
//             animationDuration={500}
//             animationEasing="ease-in-out"
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }


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
  const MAX_WINDOW = 50 * 1000; // 50 seconds

  const domain =
    data.length > 0
      ? [data[0].timestamp, data[data.length - 1].timestamp]
      : [0, MAX_WINDOW];

  const windowSize = 50 * 1000; // 50 seconds
  const maxTimestamp = data.length > 0 ? data[data.length - 1].timestamp : Date.now();
  const minTimestamp = maxTimestamp - windowSize;

  return (
    <div className="p-4 bg-white rounded-2xl shadow w-full">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          {/* <XAxis
            dataKey="timestamp"
            domain={domain}
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
          /> */}
        
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
