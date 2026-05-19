import type { DataTableProps } from '@ecom/core-ui'

export type InventoryStatus = 'OK' | 'Low'

export interface InventoryRow {
  id: string
  image: string
  name: string
  category: string
  sku: string
  onHand: number
  incoming: number
  reserved: number
  available: number
  threshold: number
  status: InventoryStatus
}

export interface InventoryProps {
  title?: string
  description?: string
  exportHref?: string
  inventory?: InventoryRow[]
  columns?: DataTableProps<InventoryRow>['columns']
  searchPlaceholder?: string
  emptyMessage?: string
  filterInventory?: (params: InventoryFilterParams) => InventoryRow[]
}

export interface InventoryFilterParams {
  inventory: InventoryRow[]
  search: string
  lowStockOnly: boolean
}
