'use client'

import { useEffect, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type RowSelectionState,
} from '@tanstack/react-table'
import type { PaginationMeta } from '@ecom/shared/pagination/core'
import { cn } from '../../lib/utils'
import type {
  DataTableProps,
  StatusBadgeProps,
  StatusTabsProps,
  TableToolbarProps,
} from './DataTable.types'

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
  emptyMessage = 'No results found',
}: DataTableProps<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  useEffect(() => {
    setRowSelection({})
    onSelectionChange?.([])
  }, [data, onSelectionChange])

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    enableRowSelection,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater
      setRowSelection(next)
      if (onSelectionChange) {
        const selectedRows = Object.keys(next)
          .filter((key) => next[key])
          .flatMap((key) => {
            const row = data.find((r) => r.id === key)
            return row ? [row] : []
          })
        onSelectionChange(selectedRows)
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  const selectedCount = Object.keys(rowSelection).filter((key) => rowSelection[key]).length

  return (
    <div className="space-y-4">
      {toolbar && <div>{toolbar}</div>}

      {selectedCount > 0 && bulkActions && (
        <div className="bg-muted/50 flex items-center gap-2 rounded-lg border p-2 text-sm">
          <span className="font-medium">{selectedCount} selected</span>
          {bulkActions}
        </div>
      )}

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="bg-muted/50 border-b text-left">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-muted-foreground sticky top-0 px-4 py-3 font-medium"
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
                ? Array.from({ length: 10 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                      {columns.map((_, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3">
                          <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                : table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/50 border-b">
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
                    className="text-muted-foreground px-4 py-8 text-center"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {meta && meta.totalPages > 1 && (
        <Pagination meta={meta} {...(onPageChange !== undefined ? { onPageChange } : {})} />
      )}
    </div>
  )
}

function Pagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta
  onPageChange?: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        Showing {(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of{' '}
        {meta.total}
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
  )
}

export function StatusBadge({ status }: StatusBadgeProps) {
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
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        styles[status] ?? 'bg-gray-100 text-gray-700',
      )}
    >
      {status}
    </span>
  )
}

export function TableToolbar({
  search,
  onSearchChange,
  placeholder = 'Search...',
  children,
}: TableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full max-w-sm rounded-md border px-3 py-1 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
      />
      {children}
    </div>
  )
}

export function StatusTabs({ tabs, value, onChange, counts }: StatusTabsProps) {
  return (
    <div className="flex flex-wrap gap-1 border-b">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            'px-3 py-2 text-sm font-medium transition-colors',
            value === tab
              ? 'border-primary text-primary border-b-2'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {tab}
          {counts && tab !== 'ALL' && counts[tab] != null && (
            <span className="text-muted-foreground ml-1.5 text-xs">({counts[tab]})</span>
          )}
        </button>
      ))}
    </div>
  )
}
