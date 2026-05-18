import type { ReactNode } from 'react'
import { Checkbox, StatusBadge } from '@ecom/core-ui'
import type { DataTableProps } from '@ecom/core-ui'
import { productStatusTabs } from './Products.fixtures'
import type { ProductRow, ProductsFilterParams, ProductsStatusTab } from './Products.types'

interface SelectAllTableContext {
  getIsAllRowsSelected: () => boolean
  getToggleAllRowsSelectedHandler: () => (value: unknown) => void
}

interface SelectRowContext {
  getIsSelected: () => boolean
  getToggleSelectedHandler: () => (value: unknown) => void
  original: ProductRow
}

interface HeaderContext {
  table: SelectAllTableContext
}

interface ProductCellContext {
  row: SelectRowContext
}

interface DisplayColumn {
  id: string
  header: string | ((context: HeaderContext) => ReactNode)
  cell: (context: ProductCellContext) => ReactNode
}

interface AccessorColumn {
  accessorKey: keyof ProductRow
  header: string
  cell?: (context: ProductCellContext) => ReactNode
}

type ProductsColumn = DisplayColumn | AccessorColumn

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function isProductsStatusTab(value: string): value is ProductsStatusTab {
  return productStatusTabs.some((tab) => tab === value)
}

export function buildProductStatusCounts(
  products: ProductRow[],
): Record<ProductsStatusTab, number> {
  const counts: Record<ProductsStatusTab, number> = {
    ALL: 0,
    LIVE: 0,
    DRAFT: 0,
    OUT_OF_STOCK: 0,
    PENDING: 0,
    BLOCKED: 0,
    SCHEDULED: 0,
  }

  for (const product of products) {
    counts.ALL += 1
    counts[product.status] += 1
  }

  return counts
}

export function filterProductsBySearchAndStatus({
  products,
  search,
  status,
}: ProductsFilterParams): ProductRow[] {
  const query = search.trim().toLowerCase()

  return products.filter((product) => {
    const matchesStatus = status === 'ALL' || product.status === status
    const matchesSearch =
      query.length === 0 ||
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })
}

const selectColumn: DisplayColumn = {
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      onCheckedChange={table.getToggleAllRowsSelectedHandler()}
      aria-label="Select all products"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={row.getToggleSelectedHandler()}
      aria-label={`Select ${row.original.name}`}
    />
  ),
}

const productColumn: DisplayColumn = {
  id: 'product',
  header: 'Product',
  cell: ({ row }) => {
    const product = row.original

    return (
      <div className="flex items-center gap-3">
        <img src={product.image} alt={product.name} className="h-11 w-11 rounded-xl object-cover" />
        <div className="min-w-0">
          <div className="truncate text-[15px] font-medium text-slate-950">{product.name}</div>
          <div className="text-sm text-slate-500">
            {product.sku} - {product.category}
          </div>
        </div>
      </div>
    )
  },
}

const statusColumn: AccessorColumn = {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => <StatusBadge status={row.original.status} />,
}

const priceColumn: AccessorColumn = {
  accessorKey: 'price',
  header: 'Price',
  cell: ({ row }) => (
    <span className="font-medium text-orange-600">{priceFormatter.format(row.original.price)}</span>
  ),
}

const stockColumn: AccessorColumn = {
  accessorKey: 'stock',
  header: 'Stock',
}

const soldColumn: AccessorColumn = {
  accessorKey: 'sold',
  header: 'Sold',
}

const ratingColumn: AccessorColumn = {
  accessorKey: 'rating',
  header: 'Rating',
  cell: ({ row }) => row.original.rating.toFixed(1),
}

const productsColumnsDefinition: ProductsColumn[] = [
  selectColumn,
  productColumn,
  statusColumn,
  priceColumn,
  stockColumn,
  soldColumn,
  ratingColumn,
]

export const productsColumns =
  productsColumnsDefinition as unknown as DataTableProps<ProductRow>['columns']
