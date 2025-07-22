import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import React from 'react';

import type { AlertEvent } from '../hooks/useTelemetry';

type EventTableProps = {
  events: AlertEvent[];
};

const columnHelper = createColumnHelper<AlertEvent>();

const columns = [
  columnHelper.accessor('time', {
    header: () => 'Time',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('metric', {
    header: () => 'Metric',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('value', {
    header: () => 'Value',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('threshold', {
    header: () => 'Acceptable Range',
  })
];

export default function EventTable({ events }: EventTableProps) {
  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 border-t">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// export default function EventTable({ events }: EventTableProps) {
//     const [data, _setData] = React.useState([...events]);

//     const table = useReactTable({
//         data: events,
//         columns,
//         getCoreRowModel: getCoreRowModel(),
//     });
//     return (
//         <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
//         {/* Your table here */}
//         <table>
//             <thead>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                     <tr key={headerGroup.id}>
//                         {headerGroup.headers.map((header) => (
//                         <th key={header.id}>
//                             {header.isPlaceholder
//                             ? null
//                             : flexRender(
//                                 header.column.columnDef.header,
//                                 header.getContext()
//                                 )}
//                         </th>
//                         ))}
//                     </tr>
//                 ))}
//             </thead>
//             <tbody>
//                 {table.getRowModel().rows.map((row) => (
//                     <tr key={row.id}>
//                     {row.getVisibleCells().map((cell) => (
//                         <td key={cell.id} className="px-4 py-2 border-t">
//                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                         </td>
//                     ))}
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//         </div>
//     );
// }
