import { Checkbox } from '@ecom/core-ui'
import type { DataTableColumn } from '@ecom/core-ui'
import { orderStatusTabs } from './Orders.fixtures'
import type { OrderRow, OrdersFilterParams, OrdersStatusTab } from './Orders.types'

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const STATUS_BADGE_STYLES: Record<Exclude<OrdersStatusTab, 'ALL'>, string> = {
  TO_PAY: 'bg-warning/10 text-warning',
  TO_SHIP: 'bg-info/10 text-info',
  PACKING: 'bg-primary-soft text-primary-deep',
  SHIPPING: 'bg-accent text-accent-foreground',
  COMPLETED: 'bg-success/10 text-success',
  CANCELLED: 'bg-muted text-muted-foreground',
}

const STATUS_LABELS: Record<OrdersStatusTab, string> = {
  ALL: 'All',
  TO_PAY: 'To pay',
  TO_SHIP: 'To ship',
  PACKING: 'Packing',
  SHIPPING: 'Shipping',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

function buildThumbnailClass(seed: string) {
  const palette = [
    'from-muted to-secondary',
    'from-accent to-secondary',
    'from-primary-soft to-accent',
    'from-info/15 to-secondary',
    'from-success/15 to-secondary',
  ]

  const index =
    seed.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0) % palette.length

  return palette[index]
}

export function getOrdersStatusLabel(status: OrdersStatusTab) {
  return STATUS_LABELS[status]
}

export function isOrdersStatusTab(value: string): value is OrdersStatusTab {
  return orderStatusTabs.some((tab) => tab === value)
}

export function buildOrderStatusCounts(orders: OrderRow[]): Record<OrdersStatusTab, number> {
  const counts: Record<OrdersStatusTab, number> = {
    ALL: 0,
    TO_PAY: 0,
    TO_SHIP: 0,
    PACKING: 0,
    SHIPPING: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  }

  for (const order of orders) {
    counts.ALL += 1
    counts[order.status] += 1
  }

  return counts
}

export function filterOrdersBySearchAndStatus({
  orders,
  search,
  status,
}: OrdersFilterParams): OrderRow[] {
  const query = search.trim().toLowerCase()

  return orders.filter((order) => {
    const matchesStatus = status === 'ALL' || order.status === status
    const matchesSearch =
      query.length === 0 ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.buyerName.toLowerCase().includes(query) ||
      order.items.some((item) => item.productName.toLowerCase().includes(query))

    return matchesStatus && matchesSearch
  })
}

function OrderStatusBadge({ status }: { status: Exclude<OrdersStatusTab, 'ALL'> }) {
  return (
    <span
      className={`inline-flex h-8 items-center rounded-full px-3 text-sm font-medium ${STATUS_BADGE_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

const selectColumn: DataTableColumn<OrderRow> = {
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllRowsSelected()}
      onCheckedChange={table.getToggleAllRowsSelectedHandler()}
      aria-label="Select all orders"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={row.getToggleSelectedHandler()}
      aria-label={`Select ${row.original.orderNumber}`}
    />
  ),
}

const orderColumn: DataTableColumn<OrderRow> = {
  id: 'orderNumber',
  header: 'Order',
  cell: ({ row }) => {
    const order = row.original

    return order.href ? (
      <a href={order.href} className="text-foreground font-semibold hover:underline">
        {order.orderNumber}
      </a>
    ) : (
      <span className="text-foreground font-semibold">{order.orderNumber}</span>
    )
  },
}

const buyerColumn: DataTableColumn<OrderRow> = {
  accessorKey: 'buyerName',
  header: 'Buyer',
}

const itemsColumn: DataTableColumn<OrderRow> = {
  id: 'items',
  header: 'Items',
  cell: ({ row }) => {
    const [firstItem] = row.original.items
    const additionalCount = Math.max(0, row.original.itemCount - 1)

    if (!firstItem) {
      return <span className="text-muted-foreground">-</span>
    }

    return (
      <div className="flex items-center gap-3">
        {firstItem.image ? (
          <img
            src={firstItem.image}
            alt={firstItem.productName}
            className="h-11 w-11 rounded-xl object-cover"
          />
        ) : (
          <div
            className={`text-foreground flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${buildThumbnailClass(firstItem.productName)} text-xs font-semibold`}
          >
            {firstItem.productName
              .split(' ')
              .slice(0, 2)
              .map((part) => part[0])
              .join('')}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-foreground truncate text-sm font-medium">
            {firstItem.productName}
          </div>
          <div className="mt-1 flex items-center gap-2">
            {firstItem.variantLabel ? (
              <span className="text-muted-foreground text-sm">{firstItem.variantLabel}</span>
            ) : null}
            {additionalCount > 0 ? (
              <span className="bg-muted text-muted-foreground inline-flex rounded-full px-2 py-0.5 text-xs">
                +{additionalCount}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    )
  },
}

const totalColumn: DataTableColumn<OrderRow> = {
  accessorKey: 'total',
  header: 'Total',
  cell: ({ row }) => (
    <span className="text-foreground font-semibold">
      {moneyFormatter.format(row.original.total)}
    </span>
  ),
}

const statusColumn: DataTableColumn<OrderRow> = {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => (
    <OrderStatusBadge status={row.original.status as Exclude<OrdersStatusTab, 'ALL'>} />
  ),
}

const dateColumn: DataTableColumn<OrderRow> = {
  accessorKey: 'createdAtLabel',
  header: 'Date',
  cell: ({ row }) => <span className="text-muted-foreground">{row.original.createdAtLabel}</span>,
}

export const ordersColumns: DataTableColumn<OrderRow>[] = [
  selectColumn,
  orderColumn,
  buyerColumn,
  itemsColumn,
  totalColumn,
  statusColumn,
  dateColumn,
]
