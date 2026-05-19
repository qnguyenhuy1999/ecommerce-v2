import type { OrderRow, OrdersProps, OrdersStatusTab } from './Orders.types'
import {
  buildOrderStatusCounts,
  filterOrdersBySearchAndStatus,
  ordersColumns,
} from './Orders.utils'

export const orderStatusTabs = [
  'ALL',
  'TO_PAY',
  'TO_SHIP',
  'PACKING',
  'SHIPPING',
  'COMPLETED',
  'CANCELLED',
] as const satisfies readonly OrdersStatusTab[]

export const ordersPageRows: OrderRow[] = [
  {
    id: 'seller-order-100340',
    orderNumber: 'ORD-100340',
    buyerName: 'Alex Tan',
    items: [{ id: 'item-1', productName: 'Wireless ANC Headphones - Studio Edition' }],
    itemCount: 1,
    total: 9,
    status: 'TO_PAY',
    createdAtLabel: 'May 11, 2026',
    href: '/orders/seller-order-100340',
  },
  {
    id: 'seller-order-100341',
    orderNumber: 'ORD-100341',
    buyerName: 'Priya R.',
    items: [
      { id: 'item-2', productName: 'Ceramic Pour-Over Coffee Set' },
      { id: 'item-3', productName: 'Aroma Diffuser, Walnut Wood' },
    ],
    itemCount: 2,
    total: 296,
    status: 'TO_SHIP',
    createdAtLabel: 'May 11, 2026',
    href: '/orders/seller-order-100341',
  },
  {
    id: 'seller-order-100342',
    orderNumber: 'ORD-100342',
    buyerName: 'Marco D.',
    items: [{ id: 'item-4', productName: 'Performance Running Shoes v3' }],
    itemCount: 1,
    total: 261,
    status: 'SHIPPING',
    createdAtLabel: 'May 10, 2026',
    href: '/orders/seller-order-100342',
  },
  {
    id: 'seller-order-100343',
    orderNumber: 'ORD-100343',
    buyerName: 'Chloe N.',
    items: [{ id: 'item-5', productName: 'Cotton Crewneck Tee, 3-Pack' }],
    itemCount: 1,
    total: 356,
    status: 'COMPLETED',
    createdAtLabel: 'May 10, 2026',
    href: '/orders/seller-order-100343',
  },
  {
    id: 'seller-order-100344',
    orderNumber: 'ORD-100344',
    buyerName: 'Sam W.',
    items: [{ id: 'item-6', productName: 'Silk Pillowcase, King Size' }],
    itemCount: 1,
    total: 972,
    status: 'CANCELLED',
    createdAtLabel: 'May 9, 2026',
    href: '/orders/seller-order-100344',
  },
]

export const ordersDefaultProps: Required<
  Pick<
    OrdersProps,
    | 'title'
    | 'description'
    | 'exportHref'
    | 'dateRangeLabel'
    | 'loading'
    | 'orders'
    | 'columns'
    | 'statusTabs'
    | 'defaultStatus'
    | 'searchPlaceholder'
    | 'emptyMessage'
    | 'filterOrders'
  >
> &
  Pick<OrdersProps, 'statusCounts' | 'status' | 'search'> = {
  title: 'Orders',
  description: 'Manage and fulfill incoming orders',
  exportHref: '#',
  dateRangeLabel: 'Last 30 days',
  loading: false,
  orders: ordersPageRows,
  columns: ordersColumns,
  statusTabs: [...orderStatusTabs],
  defaultStatus: 'ALL',
  statusCounts: buildOrderStatusCounts(ordersPageRows),
  search: '',
  searchPlaceholder: 'Search order ID, buyer...',
  emptyMessage: 'No orders yet',
  filterOrders: filterOrdersBySearchAndStatus,
}
