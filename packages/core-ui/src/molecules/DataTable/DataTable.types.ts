import type { ColumnDef } from '@tanstack/react-table'
import type { PaginationMeta } from '@ecom/shared/pagination/core'

export interface DataTableProps<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[]
  data: T[]
  meta?: PaginationMeta
  loading?: boolean
  onPageChange?: (page: number) => void
  enableRowSelection?: boolean
  onSelectionChange?: (rows: T[]) => void
  toolbar?: React.ReactNode
  bulkActions?: React.ReactNode
  emptyMessage?: string
}

export interface StatusBadgeProps {
  status: string
}

export interface TableToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  placeholder?: string
  children?: React.ReactNode
}

export interface StatusTabsProps {
  tabs: string[]
  value: string
  onChange: (tab: string) => void
  counts?: Record<string, number>
}
