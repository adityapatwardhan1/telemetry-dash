// // // import React from "react";
// // // import type { Threshold } from "../types/Threshold"

// // // type Props = {
// // //   thresholds: Threshold[];
// // //   onEdit: (metric: string) => void;
// // //   onDelete: (metric: string) => void;
// // // };

// // // export default function ThresholdTable({ thresholds, onEdit, onDelete }: Props) {
// // //   return (
// // //     <table className="w-full table-auto bg-white rounded shadow">
// // //       <thead>
// // //         <tr>
// // //           <th className="border px-3 py-2">Metric</th>
// // //           <th className="border px-3 py-2">Min</th>
// // //           <th className="border px-3 py-2">Max</th>
// // //           <th className="border px-3 py-2">Actions</th>
// // //         </tr>
// // //       </thead>
// // //       <tbody>
// // //         {thresholds.map(({ metric, min, max }) => (
// // //           <tr key={metric}>
// // //             <td className="border px-3 py-2">{metric.toUpperCase()}</td>
// // //             <td className="border px-3 py-2">{min}</td>
// // //             <td className="border px-3 py-2">{max}</td>
// // //             <td className="border px-3 py-2 space-x-2">
// // //               <button
// // //                 className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
// // //                 onClick={() => onEdit(metric)}
// // //               >
// // //                 Edit
// // //               </button>
// // //               <button
// // //                 className="bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
// // //                 onClick={() => onDelete(metric)}
// // //               >
// // //                 Delete
// // //               </button>
// // //             </td>
// // //           </tr>
// // //         ))}
// // //         {thresholds.length === 0 && (
// // //           <tr>
// // //             <td colSpan={4} className="text-center py-4 text-gray-500">
// // //               No thresholds set.
// // //             </td>
// // //           </tr>
// // //         )}
// // //       </tbody>
// // //     </table>
// // //   );
// // // }


// // import React from "react";
// // import type { Threshold } from "../types/Threshold";

// // type Props = {
// //   thresholds: Threshold[];
// //   onEdit: (metric: string) => void;
// //   onDelete: (metric: string) => void;
// // };

// // export default function ThresholdTable({ thresholds, onEdit, onDelete }: Props) {
// //   return (
// //     <div className="overflow-x-auto rounded shadow">
// //       <table className="w-full table-auto bg-white dark:bg-zinc-900 rounded">
// //         <thead className="bg-zinc-200 dark:bg-zinc-800 text-left text-zinc-800 dark:text-zinc-200">
// //           <tr>
// //             <th className="border px-4 py-2">Metric</th>
// //             <th className="border px-4 py-2">Min</th>
// //             <th className="border px-4 py-2">Max</th>
// //             <th className="border px-4 py-2">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {thresholds.length > 0 ? (
// //             thresholds.map(({ metric, min, max }, index) => (
// //               <tr
// //                 key={metric}
// //                 className={`${
// //                   index % 2 === 0
// //                     ? "bg-zinc-100 dark:bg-zinc-800"
// //                     : "bg-zinc-50 dark:bg-zinc-700"
// //                 } text-zinc-900 dark:text-zinc-100`}
// //               >
// //                 <td className="border px-4 py-2 font-medium">
// //                   {metric.toUpperCase()}
// //                 </td>
// //                 <td className="border px-4 py-2">{min}</td>
// //                 <td className="border px-4 py-2">{max}</td>
// //                 <td className="border px-4 py-2 space-x-2">
// //                   <button
// //                     className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded"
// //                     onClick={() => onEdit(metric)}
// //                   >
// //                     Edit
// //                   </button>
// //                   <button
// //                     className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
// //                     onClick={() => onDelete(metric)}
// //                   >
// //                     Delete
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))
// //           ) : (
// //             <tr>
// //               <td
// //                 colSpan={4}
// //                 className="text-center py-4 text-zinc-500 dark:text-zinc-400"
// //               >
// //                 No thresholds set.
// //               </td>
// //             </tr>
// //           )}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }


// import React from "react";
// import type { Threshold } from "../types/Threshold";

// type Props = {
//   thresholds: Threshold[];
//   onEdit: (threshold: Threshold) => void;
//   onDelete: (threshold: Threshold) => void;
// };

// export default function ThresholdTable({ thresholds, onEdit, onDelete }: Props) {
//   return (
//     <table className="w-full table-auto bg-white dark:bg-zinc-900 rounded shadow">
//       <thead className="bg-zinc-200 dark:bg-zinc-800 text-left text-zinc-800 dark:text-zinc-200">
//         <tr>
//           <th className="border px-4 py-2">Metric</th>
//           <th className="border px-4 py-2">Min</th>
//           <th className="border px-4 py-2">Max</th>
//           <th className="border px-4 py-2">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {thresholds.length > 0 ? (
//           thresholds.map((threshold, index) => (
//             <tr
//               key={threshold.metric}
//               className={`${
//                 index % 2 === 0
//                   ? "bg-zinc-100 dark:bg-zinc-800"
//                   : "bg-zinc-50 dark:bg-zinc-700"
//               } text-zinc-900 dark:text-zinc-100`}
//             >
//               <td className="border px-4 py-2 font-medium">
//                 {threshold.metric.toUpperCase()}
//               </td>
//               <td className="border px-4 py-2">{threshold.min}</td>
//               <td className="border px-4 py-2">{threshold.max}</td>
//               <td className="border px-4 py-2 space-x-2">
//                 <button
//                   className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded"
//                   onClick={() => onEdit(threshold)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
//                   onClick={() => onDelete(threshold)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))
//         ) : (
//           <tr>
//             <td
//               colSpan={4}
//               className="text-center py-4 text-zinc-500 dark:text-zinc-400"
//             >
//               No thresholds set.
//             </td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   );
// }


import React from "react";
import type { Threshold } from "../types/Threshold";

type Props = {
  thresholds: Threshold[];
  onEdit: (threshold: Threshold) => void;
  onDelete: (threshold: Threshold) => void;
};

export default function ThresholdTable({ thresholds, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded shadow">
      <table className="w-full table-auto bg-white dark:bg-zinc-900 rounded">
        <thead className="bg-zinc-200 dark:bg-zinc-800 text-left text-zinc-800 dark:text-zinc-200">
          <tr>
            <th className="border px-4 py-2">Metric</th>
            <th className="border px-4 py-2">Min</th>
            <th className="border px-4 py-2">Max</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {thresholds.length > 0 ? (
            thresholds.map((threshold, index) => (
              <tr
                key={`${threshold.id}-${threshold.metric}`}
                className={`${
                  index % 2 === 0
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : "bg-zinc-50 dark:bg-zinc-700"
                } text-zinc-900 dark:text-zinc-100`}
              >
                <td className="border px-4 py-2 font-medium">
                  {threshold.metric.toUpperCase()}
                </td>
                <td className="border px-4 py-2">{threshold.min}</td>
                <td className="border px-4 py-2">{threshold.max}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded"
                    onClick={() => onEdit(threshold)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => onDelete(threshold)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="text-center py-4 text-zinc-500 dark:text-zinc-400"
              >
                No thresholds set.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
