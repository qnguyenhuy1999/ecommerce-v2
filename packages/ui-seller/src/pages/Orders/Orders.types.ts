import type { DataTableProps } from '@ecom/core-ui'
import type { PaginationMeta } from '@ecom/shared/pagination/core'

export type OrdersStatusTab =
  | 'ALL'
  | 'TO_PAY'
  | 'TO_SHIP'
  | 'PACKING'
  | 'SHIPPING'
  | 'COMPLETED'
  | 'CANCELLED'

export interface OrderRowItem {
  id: string
  productName: string
  variantLabel?: string
  image?: string
}

export interface OrderRow {
  id: string
  orderNumber: string
  buyerName: string
  items: OrderRowItem[]
  itemCount: number
  total: number
  status: OrdersStatusTab
  createdAtLabel: string
  href?: string
}

export interface OrdersProps {
  title?: string
  description?: string
  exportHref?: string
  dateRangeLabel?: string
  loading?: boolean
  orders?: OrderRow[]
  columns?: DataTableProps<OrderRow>['columns']
  statusTabs?: OrdersStatusTab[]
  status?: OrdersStatusTab
  defaultStatus?: OrdersStatusTab
  onStatusChange?: (status: OrdersStatusTab) => void
  statusCounts?: Record<OrdersStatusTab, number>
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  emptyMessage?: string
  meta?: PaginationMeta
  onPageChange?: (page: number) => void
  filterOrders?: (params: OrdersFilterParams) => OrderRow[]
}

export interface OrdersFilterParams {
  orders: OrderRow[]
  search: string
  status: OrdersStatusTab
}
