import type {
  OrderDetailProps,
  OrderDetailRecord,
  OrderDetailStatusAction,
} from './OrderDetail.types'
import { buildOrderDetailStatusActions } from './OrderDetail.utils'

export const orderDetailFixture: OrderDetailRecord = {
  id: 'seller-order-100340',
  orderNumber: 'ORD-100340',
  status: 'PENDING',
  createdAt: 'May 11, 2026, 10:24 AM',
  updatedAt: 'May 11, 2026, 10:24 AM',
  totalAmount: 296,
  subtotalAmount: 284,
  shippingAmount: 12,
  itemCount: 2,
  customer: {
    name: 'Alex Tan',
    phone: '+1 (555) 019-8842',
    address: '114 Market Street, San Francisco, CA 94105',
  },
  items: [
    {
      id: 'item-1',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=96&q=80',
      productName: 'Wireless ANC Headphones - Studio Edition',
      variantLabel: 'Black / Standard',
      sku: 'SKU LUM-1000-BLK',
      quantity: 1,
      unitPrice: 149,
      totalPrice: 149,
    },
    {
      id: 'item-2',
      image:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=96&q=80',
      productName: 'Ceramic Pour-Over Coffee Set',
      variantLabel: 'Matte White',
      sku: 'SKU LUM-1003-WHT',
      quantity: 1,
      unitPrice: 135,
      totalPrice: 135,
    },
  ],
  shipment: {
    status: 'PENDING',
    providerName: 'ShipExpress',
  },
  auditLogs: [
    {
      id: 'log-1',
      label: 'Order placed',
      timestamp: 'May 11, 2026, 10:24 AM',
      note: 'Buyer submitted the order.',
    },
    {
      id: 'log-2',
      label: 'Payment received',
      timestamp: 'May 11, 2026, 10:25 AM',
    },
  ],
}

export const orderDetailFixtureActions: OrderDetailStatusAction[] = buildOrderDetailStatusActions(
  orderDetailFixture.status,
)

export const orderDetailDefaultProps: Required<
  Pick<
    OrderDetailProps,
    'title' | 'description' | 'breadcrumb' | 'backHref' | 'emptyMessage' | 'loading'
  >
> &
  Pick<OrderDetailProps, 'order' | 'statusActions' | 'actionInFlight'> = {
  title: 'Order detail',
  description: 'Review items, delivery details, and update fulfillment status.',
  breadcrumb: [{ label: 'Orders', href: '/orders' }, { label: orderDetailFixture.orderNumber }],
  backHref: '/orders',
  order: orderDetailFixture,
  statusActions: orderDetailFixtureActions,
  emptyMessage: 'Order not found.',
  loading: false,
  actionInFlight: null,
}
