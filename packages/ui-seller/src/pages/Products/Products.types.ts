import type { DataTableProps } from '@ecom/core-ui'

export type ProductsStatus = 'LIVE' | 'DRAFT' | 'OUT_OF_STOCK' | 'PENDING' | 'BLOCKED' | 'SCHEDULED'

export type ProductsStatusTab = 'ALL' | ProductsStatus

export interface ProductRow {
  id: string
  image: string
  name: string
  sku: string
  category: string
  status: ProductsStatus
  price: number
  stock: number
  sold: string
  rating: number
}

export interface ProductsProps {
  title?: string
  description?: string
  importHref?: string
  exportHref?: string
  newProductHref?: string
  products?: ProductRow[]
  columns?: DataTableProps<ProductRow>['columns']
  statusTabs?: ProductsStatusTab[]
  status?: ProductsStatusTab
  defaultStatus?: ProductsStatusTab
  onStatusChange?: (status: ProductsStatusTab) => void
  statusCounts?: Record<ProductsStatusTab, number>
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  emptyMessage?: string
  filterProducts?: (params: ProductsFilterParams) => ProductRow[]
}

export interface ProductsFilterParams {
  products: ProductRow[]
  search: string
  status: ProductsStatusTab
}
