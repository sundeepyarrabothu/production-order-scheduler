import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ProductionOrder, OrderStatus } from '@/types';
import { useResourceStore } from '@/store/resourceStore';

interface OrderTableProps {
  orders: ProductionOrder[];
  onEditOrder: (order: ProductionOrder) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onEditOrder }) => {
  const { getResourceById } = useResourceStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columnHelper = createColumnHelper<ProductionOrder>();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Order Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(info.getValue())}`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('resourceId', {
      header: 'Resource',
      cell: info => {
        const resourceId = info.getValue();
        if (!resourceId) return 'Not Assigned';
        const resource = getResourceById(resourceId);
        return resource ? resource.name : 'Unknown Resource';
      },
    }),
    columnHelper.accessor('startTime', {
      header: 'Start Time',
      cell: info => {
        const date = info.getValue();
        return date ? format(date, 'MMM d, yyyy h:mm a') : 'Not Scheduled';
      },
    }),
    columnHelper.accessor('endTime', {
      header: 'End Time',
      cell: info => {
        const date = info.getValue();
        return date ? format(date, 'MMM d, yyyy h:mm a') : 'Not Scheduled';
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: info => format(info.getValue(), 'MMM d, yyyy'),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: props => (
        <button
          onClick={() => onEditOrder(props.row.original)}
          className="text-blue-600 hover:text-blue-800"
        >
          Edit
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Filter by status
  const handleStatusFilter = (status: OrderStatus | 'All') => {
    if (status === 'All') {
      setColumnFilters(filters => filters.filter(f => f.id !== 'status'));
    } else {
      setColumnFilters(filters => {
        const newFilters = filters.filter(f => f.id !== 'status');
        newFilters.push({ id: 'status', value: status });
        return newFilters;
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Production Orders</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusFilter('All')}
            className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
          >
            All
          </button>
          <button
            onClick={() => handleStatusFilter('Pending')}
            className="px-3 py-1 text-sm rounded-md bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusFilter('Scheduled')}
            className="px-3 py-1 text-sm rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800"
          >
            Scheduled
          </button>
          <button
            onClick={() => handleStatusFilter('In Progress')}
            className="px-3 py-1 text-sm rounded-md bg-purple-100 hover:bg-purple-200 text-purple-800"
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusFilter('Completed')}
            className="px-3 py-1 text-sm rounded-md bg-green-100 hover:bg-green-200 text-green-800"
          >
            Completed
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper function to get status color
const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'In Progress':
      return 'bg-purple-100 text-purple-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default OrderTable;
