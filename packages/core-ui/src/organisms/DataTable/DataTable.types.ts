import type { PaginationMeta } from '@ecom/shared/pagination/core'
import type { RowData, TableOptions } from '@tanstack/react-table'

export type DataTableColumn<T extends RowData> = TableOptions<T>['columns'][number]

export interface DataTableProps<T extends RowData> {
  columns: DataTableColumn<T>[]
  data: T[]
  meta?: PaginationMeta
  loading?: boolean
  onPageChange?: (page: number) => void
  enableRowSelection?: boolean
  onSelectionChange?: (rows: T[]) => void
  toolbar?: React.ReactNode
  bulkActions?: React.ReactNode
  emptyMessage?: string
  className?: string
}

export interface StatusBadgeProps {
  status: string
  className?: string
}

export interface TableToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  placeholder?: string
  children?: React.ReactNode
  className?: string
}

export interface StatusTabsProps {
  tabs: string[]
  value: string
  onChange: (tab: string) => void
  counts?: Record<string, number>
  className?: string
}
