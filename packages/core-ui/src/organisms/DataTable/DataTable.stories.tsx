import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '../../atoms/Checkbox'
import { DataTable, StatusBadge, StatusTabs, TableToolbar } from '.'
import { productStatusCounts, productStatusTabs, productTableRows, type ProductTableRow } from './DataTable.fixtures'

const meta = {
  title: 'Organisms/DataTable',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const col = createColumnHelper<ProductTableRow>()

const columns = [
  col.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={table.getToggleAllRowsSelectedHandler()}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={row.getToggleSelectedHandler()}
        aria-label={`Select ${row.original.name}`}
      />
    ),
  }),
  col.display({
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
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  col.accessor('price', {
    header: 'Price',
    cell: (info) => <span className="text-primary font-medium">${info.getValue()}</span>,
  }),
  col.accessor('stock', {
    header: 'Stock',
  }),
  col.accessor('sold', {
    header: 'Sold',
  }),
  col.accessor('rating', {
    header: 'Rating',
    cell: (info) => info.getValue().toFixed(1),
  }),
] as ColumnDef<ProductTableRow, unknown>[]

function isProductStatusTab(value: string): value is (typeof productStatusTabs)[number] {
  return productStatusTabs.some((tab) => tab === value)
}

function DataTableShowcase() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<(typeof productStatusTabs)[number]>('ALL')

  const filteredRows = productTableRows.filter((row) => {
    const matchesStatus = status === 'ALL' || row.status === status
    const query = search.trim().toLowerCase()
    const matchesSearch =
      query.length === 0 ||
      row.name.toLowerCase().includes(query) ||
      row.sku.toLowerCase().includes(query) ||
      row.category.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })

  return (
    <div className="bg-muted p-4 md:p-8">
      <DataTable
        columns={columns}
        data={filteredRows}
        meta={{
          page: 1,
          limit: 24,
          total: productTableRows.length,
          totalPages: 2,
          hasNextPage: true,
          hasPreviousPage: false,
        }}
        enableRowSelection
        toolbar={
          <TableToolbar search={search} onSearchChange={setSearch} placeholder="Search products or SKU...">
            <StatusTabs
              tabs={[...productStatusTabs]}
              value={status}
              onChange={(tab) => {
                if (isProductStatusTab(tab)) {
                  setStatus(tab)
                }
              }}
              counts={productStatusCounts}
            />
          </TableToolbar>
        }
      />
    </div>
  )
}

export const ProductCatalog: Story = {
  render: () => <DataTableShowcase />,
}
