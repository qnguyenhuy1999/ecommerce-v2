'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table';
import type { PaginationMeta } from '@ecom/common';

interface DataTableProps<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  data: T[];
  meta?: PaginationMeta;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  enableRowSelection?: boolean;
  onSelectionChange?: (rows: T[]) => void;
  toolbar?: React.ReactNode;
  bulkActions?: React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  meta,
  loading,
  onPageChange,
  enableRowSelection = false,
  onSelectionChange,
  toolbar,
  bulkActions,
}: DataTableProps<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    enableRowSelection,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(next);
      if (onSelectionChange) {
        const selectedRows = Object.keys(next)
          .filter((key) => next[key])
          .map((key) => data[parseInt(key, 10)]!)
          .filter(Boolean);
        onSelectionChange(selectedRows);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const selectedCount = Object.keys(rowSelection).filter((k) => rowSelection[k]).length;

  return (
    <div className="space-y-4">
      {toolbar && <div>{toolbar}</div>}

      {selectedCount > 0 && bulkActions && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2 text-sm">
          <span className="font-medium">{selectedCount} selected</span>
          {bulkActions}
        </div>
      )}

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b bg-muted/50 text-left">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="sticky top-0 px-4 py-3 font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      {columns.map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                        </td>
                      ))}
                    </tr>
                  ))
                : table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-muted/50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
              {!loading && data.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {meta && meta.totalPages > 1 && (
        <Pagination meta={meta} onPageChange={onPageChange} />
      )}
    </div>
  );
}

function Pagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange?: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        Showing {(meta.page - 1) * meta.pageSize + 1}–
        {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange?.(meta.page - 1)}
          disabled={meta.page <= 1}
          className="rounded border px-3 py-1.5 text-xs disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange?.(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="rounded border px-3 py-1.5 text-xs disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    PUBLISHED: 'bg-green-100 text-green-700',
    APPROVED: 'bg-green-100 text-green-700',
    RESOLVED: 'bg-green-100 text-green-700',
    SENT: 'bg-green-100 text-green-700',
    DELIVERED: 'bg-green-100 text-green-700',
    COMPLETED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
    DRAFT: 'bg-gray-100 text-gray-600',
    OPEN: 'bg-blue-100 text-blue-700',
    REVIEWING: 'bg-blue-100 text-blue-700',
    REQUESTED: 'bg-yellow-100 text-yellow-700',
    SCHEDULED: 'bg-purple-100 text-purple-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PACKING: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    SUSPENDED: 'bg-red-100 text-red-700',
    BANNED: 'bg-red-200 text-red-800',
    REJECTED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-700',
    ARCHIVED: 'bg-gray-100 text-gray-700',
    DISMISSED: 'bg-gray-100 text-gray-700',
    HIDDEN: 'bg-orange-100 text-orange-700',
    FAILED: 'bg-red-100 text-red-700',
    EXPIRED: 'bg-gray-100 text-gray-600',
    DEPLETED: 'bg-gray-100 text-gray-600',
    PAUSED: 'bg-yellow-100 text-yellow-700',
    INACTIVE: 'bg-gray-100 text-gray-600',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  );
}

export function TableToolbar({
  search,
  onSearchChange,
  placeholder = 'Search...',
  children,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex h-9 w-full max-w-sm rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      {children}
    </div>
  );
}

export function StatusTabs({
  tabs,
  value,
  onChange,
  counts,
}: {
  tabs: string[];
  value: string;
  onChange: (tab: string) => void;
  counts?: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap gap-1 border-b">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            value === tab
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab}
          {counts && tab !== 'ALL' && counts[tab] != null && (
            <span className="ml-1.5 text-xs text-muted-foreground">({counts[tab]})</span>
          )}
        </button>
      ))}
    </div>
  );
}
