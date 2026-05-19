import type {
  OrderDetailAuditLog,
  OrderDetailStatus,
  OrderDetailStatusAction,
} from './OrderDetail.types'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const STATUS_ACTIONS: Record<OrderDetailStatus, OrderDetailStatusAction[]> = {
  PENDING: [{ id: 'confirm', label: 'Confirm order', nextStatus: 'CONFIRMED' }],
  CONFIRMED: [
    { id: 'pack', label: 'Mark as packing', nextStatus: 'PACKING' },
    { id: 'cancel', label: 'Cancel order', nextStatus: 'CANCELLED' },
  ],
  PACKING: [{ id: 'ship', label: 'Mark as shipped', nextStatus: 'SHIPPED' }],
  SHIPPED: [{ id: 'deliver', label: 'Mark as delivered', nextStatus: 'DELIVERED' }],
  DELIVERED: [],
  CANCELLED: [],
}

export function formatOrderCurrency(amount: number) {
  return currencyFormatter.format(amount)
}

export function buildOrderDetailStatusActions(
  status: OrderDetailStatus,
): OrderDetailStatusAction[] {
  return STATUS_ACTIONS[status]
}

export function buildOrderAuditLabel(
  fromStatus?: string | null,
  toStatus?: string | null,
  fallback = 'Status updated',
) {
  if (!fromStatus && toStatus) {
    return `Moved to ${formatStatusLabel(toStatus)}`
  }

  if (fromStatus && toStatus) {
    return `${formatStatusLabel(fromStatus)} -> ${formatStatusLabel(toStatus)}`
  }

  return fallback
}

export function formatStatusLabel(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function getOrderSummaryRows(
  totalAmount: number,
  subtotalAmount?: number,
  shippingAmount?: number,
) {
  return [
    {
      label: 'Subtotal',
      value: subtotalAmount != null ? formatOrderCurrency(subtotalAmount) : null,
    },
    {
      label: 'Shipping',
      value: shippingAmount != null ? formatOrderCurrency(shippingAmount) : null,
    },
    { label: 'Total', value: formatOrderCurrency(totalAmount), emphasized: true },
  ].filter((row) => row.value != null)
}

export function ensureAuditLogs(logs?: OrderDetailAuditLog[]): OrderDetailAuditLog[] {
  return logs ?? []
}
