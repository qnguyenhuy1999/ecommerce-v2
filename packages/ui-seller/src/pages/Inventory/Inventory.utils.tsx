import { Checkbox } from '@ecom/core-ui'
import type { DataTableColumn } from '@ecom/core-ui'
import type { InventoryRow, InventoryFilterParams } from './Inventory.types'

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

const selectColumn: DataTableColumn<InventoryRow> = {
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

const productColumn: DataTableColumn<InventoryRow> = {
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

const skuColumn: DataTableColumn<InventoryRow> = {
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

const onHandColumn: DataTableColumn<InventoryRow> = {
  accessorKey: 'onHand',
  header: 'On Hand',
  cell: ({ row }) => <InputBadge value={row.original.onHand} />,
}

const incomingColumn: DataTableColumn<InventoryRow> = {
  accessorKey: 'incoming',
  header: 'Incoming',
  cell: ({ row }) => <span className="text-muted-foreground">{row.original.incoming}</span>,
}

const reservedColumn: DataTableColumn<InventoryRow> = {
  accessorKey: 'reserved',
  header: 'Reserved',
  cell: ({ row }) => <span className="text-muted-foreground">{row.original.reserved}</span>,
}

const availableColumn: DataTableColumn<InventoryRow> = {
  accessorKey: 'available',
  header: 'Available',
  cell: ({ row }) => <span className="text-foreground font-medium">{row.original.available}</span>,
}

const thresholdColumn: DataTableColumn<InventoryRow> = {
  accessorKey: 'threshold',
  header: 'Threshold',
  cell: ({ row }) => <InputBadge value={row.original.threshold} />,
}

const statusColumn: DataTableColumn<InventoryRow> = {
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

export const inventoryColumns: DataTableColumn<InventoryRow>[] = [
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
