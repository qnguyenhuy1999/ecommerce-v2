import type { ReactNode } from 'react'
import { Checkbox } from '@ecom/core-ui'
import type { DataTableProps } from '@ecom/core-ui'
import { orderStatusTabs } from './Orders.fixtures'
import type { OrderRow, OrdersFilterParams, OrdersStatusTab } from './Orders.types'

interface SelectAllTableContext {
  getIsAllRowsSelected: () => boolean
  getToggleAllRowsSelectedHandler: () => (value: unknown) => void
}

interface SelectRowContext {
  getIsSelected: () => boolean
  getToggleSelectedHandler: () => (value: unknown) => void
  original: OrderRow
}

interface HeaderContext {
  table: SelectAllTableContext
}

interface RowCellContext {
  row: SelectRowContext
}

interface DisplayColumn {
  id: string
  header: string | ((context: HeaderContext) => ReactNode)
  cell: (context: RowCellContext) => ReactNode
}

interface AccessorColumn {
  accessorKey: keyof OrderRow
  header: string
  cell?: (context: RowCellContext) => ReactNode
}

type OrdersColumn = DisplayColumn | AccessorColumn

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const STATUS_BADGE_STYLES: Record<Exclude<OrdersStatusTab, 'ALL'>, string> = {
  TO_PAY: 'bg-amber-50 text-amber-700',
  TO_SHIP: 'bg-sky-50 text-sky-700',
  PACKING: 'bg-violet-50 text-violet-700',
  SHIPPING: 'bg-indigo-50 text-indigo-700',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-slate-100 text-slate-600',
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
    'from-slate-200 to-slate-300',
    'from-stone-200 to-stone-300',
    'from-sky-200 to-indigo-200',
    'from-amber-200 to-orange-200',
    'from-emerald-200 to-teal-200',
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

const selectColumn: DisplayColumn = {
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

const orderColumn: DisplayColumn = {
  id: 'orderNumber',
  header: 'Order',
  cell: ({ row }) => {
    const order = row.original

    return order.href ? (
      <a href={order.href} className="font-semibold text-slate-950 hover:underline">
        {order.orderNumber}
      </a>
    ) : (
      <span className="font-semibold text-slate-950">{order.orderNumber}</span>
    )
  },
}

const buyerColumn: AccessorColumn = {
  accessorKey: 'buyerName',
  header: 'Buyer',
}

const itemsColumn: DisplayColumn = {
  id: 'items',
  header: 'Items',
  cell: ({ row }) => {
    const [firstItem] = row.original.items
    const additionalCount = Math.max(0, row.original.itemCount - 1)

    if (!firstItem) {
      return <span className="text-slate-500">-</span>
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
            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${buildThumbnailClass(firstItem.productName)} text-xs font-semibold text-slate-700`}
          >
            {firstItem.productName
              .split(' ')
              .slice(0, 2)
              .map((part) => part[0])
              .join('')}
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate text-[15px] font-medium text-slate-950">
            {firstItem.productName}
          </div>
          <div className="mt-1 flex items-center gap-2">
            {firstItem.variantLabel ? (
              <span className="text-sm text-slate-500">{firstItem.variantLabel}</span>
            ) : null}
            {additionalCount > 0 ? (
              <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                +{additionalCount}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    )
  },
}

const totalColumn: AccessorColumn = {
  accessorKey: 'total',
  header: 'Total',
  cell: ({ row }) => (
    <span className="font-semibold text-slate-950">
      {moneyFormatter.format(row.original.total)}
    </span>
  ),
}

const statusColumn: AccessorColumn = {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => (
    <OrderStatusBadge status={row.original.status as Exclude<OrdersStatusTab, 'ALL'>} />
  ),
}

const dateColumn: AccessorColumn = {
  accessorKey: 'createdAtLabel',
  header: 'Date',
  cell: ({ row }) => <span className="text-slate-600">{row.original.createdAtLabel}</span>,
}

const ordersColumnsDefinition: OrdersColumn[] = [
  selectColumn,
  orderColumn,
  buyerColumn,
  itemsColumn,
  totalColumn,
  statusColumn,
  dateColumn,
]

export const ordersColumns =
  ordersColumnsDefinition as unknown as DataTableProps<OrderRow>['columns']
