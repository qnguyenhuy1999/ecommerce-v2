import { Checkbox, StatusBadge } from '@ecom/core-ui'
import type { DataTableColumn } from '@ecom/core-ui'
import { productStatusTabs } from './Products.fixtures'
import type { ProductRow, ProductsFilterParams, ProductsStatusTab } from './Products.types'

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

const selectColumn: DataTableColumn<ProductRow> = {
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

const productColumn: DataTableColumn<ProductRow> = {
  id: 'product',
  header: 'Product',
  cell: ({ row }) => {
    const product = row.original

    return (
      <div className="flex items-center gap-3">
        <img src={product.image} alt={product.name} className="h-11 w-11 rounded-xl object-cover" />
        <div className="min-w-0">
          <div className="text-foreground truncate text-sm font-medium">{product.name}</div>
          <div className="text-muted-foreground text-sm">
            {product.sku} - {product.category}
          </div>
        </div>
      </div>
    )
  },
}

const statusColumn: DataTableColumn<ProductRow> = {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => <StatusBadge status={row.original.status} />,
}

const priceColumn: DataTableColumn<ProductRow> = {
  accessorKey: 'price',
  header: 'Price',
  cell: ({ row }) => (
    <span className="text-primary font-medium">{priceFormatter.format(row.original.price)}</span>
  ),
}

const stockColumn: DataTableColumn<ProductRow> = {
  accessorKey: 'stock',
  header: 'Stock',
}

const soldColumn: DataTableColumn<ProductRow> = {
  accessorKey: 'sold',
  header: 'Sold',
}

const ratingColumn: DataTableColumn<ProductRow> = {
  accessorKey: 'rating',
  header: 'Rating',
  cell: ({ row }) => row.original.rating.toFixed(1),
}

export const productsColumns: DataTableColumn<ProductRow>[] = [
  selectColumn,
  productColumn,
  statusColumn,
  priceColumn,
  stockColumn,
  soldColumn,
  ratingColumn,
]
