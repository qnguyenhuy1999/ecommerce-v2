import type { ReactNode } from 'react'
import { Checkbox } from '@ecom/core-ui'
import type { DataTableProps } from '@ecom/core-ui'
import type { InventoryRow, InventoryFilterParams } from './Inventory.types'

interface SelectAllTableContext {
  getIsAllRowsSelected: () => boolean
  getToggleAllRowsSelectedHandler: () => (value: unknown) => void
}

interface SelectRowContext {
  getIsSelected: () => boolean
  getToggleSelectedHandler: () => (value: unknown) => void
  original: InventoryRow
}

interface HeaderContext {
  table: SelectAllTableContext
}

interface InventoryCellContext {
  row: SelectRowContext
}

interface DisplayColumn {
  id: string
  header: string | ((context: HeaderContext) => ReactNode)
  cell: (context: InventoryCellContext) => ReactNode
}

interface AccessorColumn {
  accessorKey: keyof InventoryRow
  header: string
  cell?: (context: InventoryCellContext) => ReactNode
}

type InventoryColumn = DisplayColumn | AccessorColumn

export function filterInventory({
  inventory,
  search,
  lowStockOnly,
}: InventoryFilterParams): InventoryRow[] {
  const query = search.trim().toLowerCase()

  return inventory.filter((item) => {
    const matchesSearch =
      query.length === 0 ||
      item.name.toLowerCase().includes(query) ||
      item.sku.toLowerCase().includes(query)

    const matchesLowStock = lowStockOnly ? item.status === 'Low' : true

    return matchesSearch && matchesLowStock
  })
}

const selectColumn: DisplayColumn = {
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      onCheckedChange={table.getToggleAllRowsSelectedHandler()}
      aria-label="Select all inventory items"
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
    const item = row.original
    return (
      <div className="flex items-center gap-3">
        <img src={item.image} alt={item.name} className="h-11 w-11 rounded-xl object-cover" />
        <div className="min-w-0">
          <div className="text-foreground truncate text-[14px] font-medium">{item.name}</div>
          <div className="text-muted-foreground text-xs">{item.category}</div>
        </div>
      </div>
    )
  },
}

const skuColumn: AccessorColumn = {
  accessorKey: 'sku',
  header: 'SKU',
  cell: ({ row }) => (
    <span className="text-muted-foreground text-[13px] font-medium">{row.original.sku}</span>
  ),
}

const InputBadge = ({ value }: { value: number }) => (
  <div className="bg-background text-foreground border-input inline-flex w-16 items-center justify-center rounded-md border px-3 py-1 text-sm font-medium shadow-sm">
    {value}
  </div>
)

const onHandColumn: AccessorColumn = {
  accessorKey: 'onHand',
  header: 'On Hand',
  cell: ({ row }) => <InputBadge value={row.original.onHand} />,
}

const incomingColumn: AccessorColumn = {
  accessorKey: 'incoming',
  header: 'Incoming',
  cell: ({ row }) => <span className="text-muted-foreground">{row.original.incoming}</span>,
}

const reservedColumn: AccessorColumn = {
  accessorKey: 'reserved',
  header: 'Reserved',
  cell: ({ row }) => <span className="text-muted-foreground">{row.original.reserved}</span>,
}

const availableColumn: AccessorColumn = {
  accessorKey: 'available',
  header: 'Available',
  cell: ({ row }) => <span className="text-foreground font-medium">{row.original.available}</span>,
}

const thresholdColumn: AccessorColumn = {
  accessorKey: 'threshold',
  header: 'Threshold',
  cell: ({ row }) => <InputBadge value={row.original.threshold} />,
}

const statusColumn: AccessorColumn = {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => {
    const isLow = row.original.status === 'Low'

    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${isLow ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isLow ? 'bg-warning' : 'bg-success'}`} />
        {row.original.status}
      </div>
    )
  },
}

const inventoryColumnsDefinition: InventoryColumn[] = [
  selectColumn,
  productColumn,
  skuColumn,
  onHandColumn,
  incomingColumn,
  reservedColumn,
  availableColumn,
  thresholdColumn,
  statusColumn,
]

export const inventoryColumns =
  inventoryColumnsDefinition as unknown as DataTableProps<InventoryRow>['columns']
