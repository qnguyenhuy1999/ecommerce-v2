'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { withDefined } from '@ecom/shared/utils'
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
    dot: 'bg-success',
    badge: 'bg-success/10 text-success',
  },
  APPROVED: {
    dot: 'bg-success',
    badge: 'bg-success/10 text-success',
  },
  COMPLETED: {
    dot: 'bg-success',
    badge: 'bg-success/10 text-success',
  },
  CONFIRMED: {
    dot: 'bg-info',
    badge: 'bg-info/10 text-info',
  },
  DELIVERED: {
    dot: 'bg-success',
    badge: 'bg-success/10 text-success',
  },
  DRAFT: {
    dot: 'bg-muted-foreground',
    badge: 'bg-muted text-muted-foreground',
  },
  EXPIRED: {
    dot: 'bg-muted-foreground',
    badge: 'bg-muted text-muted-foreground',
  },
  FAILED: {
    dot: 'bg-destructive',
    badge: 'bg-destructive/10 text-destructive',
  },
  HIDDEN: {
    dot: 'bg-warning',
    badge: 'bg-warning/10 text-warning',
  },
  INACTIVE: {
    dot: 'bg-muted-foreground',
    badge: 'bg-muted text-muted-foreground',
  },
  LIVE: {
    dot: 'bg-success',
    badge: 'bg-success/10 text-success',
  },
  OPEN: {
    dot: 'bg-info',
    badge: 'bg-info/10 text-info',
  },
  OUT_OF_STOCK: {
    dot: 'bg-warning',
    badge: 'bg-warning/10 text-warning',
  },
  PACKING: {
    dot: 'bg-info',
    badge: 'bg-info/10 text-info',
  },
  PAUSED: {
    dot: 'bg-warning',
    badge: 'bg-warning/10 text-warning',
  },
  PENDING: {
    dot: 'bg-info',
    badge: 'bg-info/10 text-info',
  },
  PENDING_REVIEW: {
    dot: 'bg-info',
    badge: 'bg-info/10 text-info',
  },
  PUBLISHED: {
    dot: 'bg-success',
    badge: 'bg-success/10 text-success',
  },
  REQUESTED: {
    dot: 'bg-warning',
    badge: 'bg-warning/10 text-warning',
  },
  RESOLVED: {
    dot: 'bg-success',
    badge: 'bg-success/10 text-success',
  },
  REVIEWING: {
    dot: 'bg-info',
    badge: 'bg-info/10 text-info',
  },
  SCHEDULED: {
    dot: 'bg-info',
    badge: 'bg-info/10 text-info',
  },
  SENT: {
    dot: 'bg-success',
    badge: 'bg-success/10 text-success',
  },
  SHIPPED: {
    dot: 'bg-primary',
    badge: 'bg-primary-soft text-primary-deep',
  },
  SUSPENDED: {
    dot: 'bg-destructive',
    badge: 'bg-destructive/10 text-destructive',
  },
  BANNED: {
    dot: 'bg-destructive',
    badge: 'bg-destructive/10 text-destructive',
  },
  REJECTED: {
    dot: 'bg-destructive',
    badge: 'bg-destructive/10 text-destructive',
  },
  BLOCKED: {
    dot: 'bg-destructive',
    badge: 'bg-destructive/10 text-destructive',
  },
  CANCELLED: {
    dot: 'bg-muted-foreground',
    badge: 'bg-muted text-muted-foreground',
  },
  ARCHIVED: {
    dot: 'bg-muted-foreground',
    badge: 'bg-muted text-muted-foreground',
  },
  DISMISSED: {
    dot: 'bg-muted-foreground',
    badge: 'bg-muted text-muted-foreground',
  },
  DEPLETED: {
    dot: 'bg-muted-foreground',
    badge: 'bg-muted text-muted-foreground',
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
  const rowLookup = useMemo(() => {
    return data.reduce<Record<string, T>>((accumulator, row) => {
      accumulator[row.id] = row
      return accumulator
    }, {})
  }, [data])

  useEffect(() => {
    setRowSelection((current) => {
      const next = Object.fromEntries(
        Object.entries(current).filter(([key, selected]) => selected && rowLookup[key]),
      )

      const currentKeys = Object.keys(current)
      const nextKeys = Object.keys(next)
      if (
        currentKeys.length === nextKeys.length &&
        currentKeys.every((key) => current[key] === next[key])
      ) {
        return current
      }

      return next
    })
  }, [rowLookup])

  useEffect(() => {
    if (!onSelectionChange) {
      return
    }

    const selectedRows = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .flatMap((key) => {
        const row = rowLookup[key]
        return row ? [row] : []
      })

    onSelectionChange(selectedRows)
  }, [onSelectionChange, rowLookup, rowSelection])

  const handleRowSelectionChange = useCallback(
    (updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => {
      setRowSelection((current) => (typeof updater === 'function' ? updater(current) : updater))
    },
    [],
  )

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    enableRowSelection,
    onRowSelectionChange: handleRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  const selectedCount = Object.keys(rowSelection).filter((key) => rowSelection[key]).length

  return (
    <div className={cn('space-y-4', className)}>
      {selectedCount > 0 && bulkActions && (
        <div className="bg-muted text-foreground border-border flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm">
          <span className="font-medium">{selectedCount} selected</span>
          {bulkActions}
        </div>
      )}

      <div className="bg-card border-border overflow-hidden rounded-[24px] border shadow-xs">
        {toolbar && <div className="border-border border-b px-3 py-3 sm:px-4">{toolbar}</div>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-muted/90">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-[0.05em] uppercase first:pl-5 last:pr-5"
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
                    <tr key={rowIndex} className="border-border border-b last:border-b-0">
                      {columns.map((_, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="border-border border-b px-4 py-4 first:pl-5 last:pr-5"
                        >
                          <div className="bg-muted h-4 w-24 animate-pulse rounded-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="text-foreground border-border border-b px-4 py-3.5 align-middle text-sm first:pl-5 last:pr-5"
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
                    className="text-muted-foreground px-4 py-12 text-center text-sm"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta && meta.totalPages > 1 && (
          <Pagination meta={meta} {...withDefined({ onPageChange })} />
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
    <div className="text-muted-foreground border-border flex flex-col gap-3 border-t px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span>
        Showing {(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of{' '}
        {meta.total}
      </span>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPageChange?.(meta.page - 1)}
          disabled={meta.page <= 1}
          className="border-input text-muted-foreground hover:bg-muted inline-flex h-8 items-center justify-center rounded-xl border px-3 text-sm transition disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronLeft className="mr-1 h-3.5 w-3.5" />
          Prev
        </button>

        <button
          type="button"
          onClick={() => onPageChange?.(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="border-input text-muted-foreground hover:bg-muted inline-flex h-8 items-center justify-center rounded-xl border px-3 text-sm transition disabled:pointer-events-none disabled:opacity-50"
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
    dot: 'bg-muted-foreground',
    badge: 'bg-muted text-muted-foreground',
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
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="bg-background border-input placeholder:text-muted-foreground h-10 rounded-2xl pl-10 text-sm shadow-none focus-visible:ring-0"
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
                ? 'bg-primary-soft text-primary-deep'
                : 'text-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <span>{formatStatusLabel(tab)}</span>
            {counts && counts[tab] != null && (
              <span
                className={cn(
                  'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs leading-none',
                  isActive
                    ? 'bg-background/80 text-primary-deep'
                    : 'bg-muted text-muted-foreground',
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
