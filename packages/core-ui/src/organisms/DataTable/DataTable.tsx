'use client'

import { useEffect, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
} from '@tanstack/react-table'
import type { PaginationMeta } from '@ecom/shared/pagination/core'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Input } from '../../atoms/Input'
import { cn } from '../../lib/utils'
import type {
  DataTableProps,
  StatusBadgeProps,
  StatusTabsProps,
  TableToolbarProps,
} from './DataTable.types'

const STATUS_STYLES: Record<string, { dot: string; badge: string }> = {
  ACTIVE: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  APPROVED: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  COMPLETED: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  CONFIRMED: {
    dot: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700',
  },
  DELIVERED: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  DRAFT: {
    dot: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-600',
  },
  EXPIRED: {
    dot: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-600',
  },
  FAILED: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700',
  },
  HIDDEN: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700',
  },
  INACTIVE: {
    dot: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-600',
  },
  LIVE: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  OPEN: {
    dot: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700',
  },
  OUT_OF_STOCK: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-800',
  },
  PACKING: {
    dot: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700',
  },
  PAUSED: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-800',
  },
  PENDING: {
    dot: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700',
  },
  PENDING_REVIEW: {
    dot: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700',
  },
  PUBLISHED: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  REQUESTED: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-800',
  },
  RESOLVED: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  REVIEWING: {
    dot: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700',
  },
  SCHEDULED: {
    dot: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700',
  },
  SENT: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  SHIPPED: {
    dot: 'bg-indigo-500',
    badge: 'bg-indigo-50 text-indigo-700',
  },
  SUSPENDED: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700',
  },
  BANNED: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700',
  },
  REJECTED: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700',
  },
  BLOCKED: {
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700',
  },
  CANCELLED: {
    dot: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-600',
  },
  ARCHIVED: {
    dot: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-600',
  },
  DISMISSED: {
    dot: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-600',
  },
  DEPLETED: {
    dot: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-600',
  },
}

function formatStatusLabel(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
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
  emptyMessage = 'No results found',
  className,
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
            const row = data.find((item) => item.id === key)
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
    <div className={cn('space-y-4', className)}>
      {selectedCount > 0 && bulkActions && (
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <span className="font-medium">{selectedCount} selected</span>
          {bulkActions}
        </div>
      )}

      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
        {toolbar && <div className="border-b border-slate-200 px-3 py-3 sm:px-4">{toolbar}</div>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-slate-100/90">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold tracking-[0.05em] text-slate-500 uppercase first:pl-5 last:pr-5"
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
                    <tr key={rowIndex} className="border-b border-slate-200 last:border-b-0">
                      {columns.map((_, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="border-b border-slate-200 px-4 py-4 first:pl-5 last:pr-5"
                        >
                          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                : table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-slate-50/80">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="border-b border-slate-200 px-4 py-3.5 align-middle text-[15px] text-slate-900 first:pl-5 last:pr-5"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}

              {!loading && data.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-sm text-slate-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} {...(onPageChange !== undefined ? { onPageChange } : {})} />
        )}
      </div>
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
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of{' '}
        {meta.total}
      </span>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange?.(meta.page - 1)}
          disabled={meta.page <= 1}
          className="inline-flex h-8 items-center justify-center rounded-xl border border-slate-200 px-3 text-sm text-slate-600 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronLeft className="mr-1 h-3.5 w-3.5" />
          Prev
        </button>

        <button
          type="button"
          onClick={() => onPageChange?.(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="inline-flex h-8 items-center justify-center rounded-xl border border-slate-200 px-3 text-sm text-slate-600 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
        >
          Next
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase()
  const style = STATUS_STYLES[normalizedStatus] ?? {
    dot: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-600',
  }

  return (
    <span
      className={cn(
        'inline-flex h-7 items-center gap-2 rounded-full px-3 text-sm font-medium',
        style.badge,
        className,
      )}
    >
      <span className={cn('h-2.5 w-2.5 rounded-full', style.dot)} />
      {formatStatusLabel(status)}
    </span>
  )
}

export function TableToolbar({
  search,
  onSearchChange,
  placeholder = 'Search...',
  children,
  className,
}: TableToolbarProps) {
  return (
    <div className={cn('flex flex-col gap-3 lg:flex-row lg:items-center', className)}>
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-10 rounded-2xl border-slate-200 bg-white pl-10 text-sm shadow-none placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:ring-0"
        />
      </div>

      {children ? <div className="min-w-0 flex-1">{children}</div> : null}
    </div>
  )
}

export function StatusTabs({ tabs, value, onChange, counts, className }: StatusTabsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {tabs.map((tab) => {
        const isActive = value === tab

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-medium transition-colors',
              isActive
                ? 'bg-orange-50 text-orange-600'
                : 'text-slate-900 hover:bg-slate-100 hover:text-slate-900',
            )}
          >
            <span>{formatStatusLabel(tab)}</span>
            {counts && counts[tab] != null && (
              <span
                className={cn(
                  'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs leading-none',
                  isActive ? 'bg-white/80 text-orange-600' : 'bg-slate-100 text-slate-600',
                )}
              >
                {counts[tab]}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
