'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  OrderDetail,
  buildOrderDetailStatusActions,
  type OrderDetailRecord,
  type OrderDetailStatus,
} from '@ecom/ui-seller'
import type { SellerPaths } from '@ecom/contracts/generated'
import { DashboardLayout } from '../../../components/dashboard-layout'
import { api } from '../../../lib/api'

interface SellerOrderDetailResponse {
  data?: SellerOrderDetailApi
}

interface SellerOrderDetailApi {
  id: string
  status: OrderDetailStatus
  totalAmount: number
  subtotal: number
  shippingFee: number
  createdAt: string
  updatedAt: string
  order: {
    id: string
    shippingName: string
    shippingPhone: string | null
    shippingAddress: string | null
  }
  items: Array<{
    id: string
    productName: string
    variantLabel: string | null
    quantity: number
    unitPrice: number
    totalPrice: number
    variant: {
      sku: string
      product: {
        id: string
        name: string
      }
    }
  }>
  shipment: null | {
    status: string
    trackingNumber: string | null
    provider: null | {
      name: string
    }
  }
  auditLogs: Array<{
    id: string
    fromStatus: string | null
    toStatus: string | null
    note: string | null
    createdAt: string
  }>
}

type UpdateOrderStatusRequest =
  SellerPaths['/orders/{id}/status']['put']['requestBody']['content']['application/json']

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatAuditLabel(fromStatus: string | null, toStatus: string | null) {
  if (fromStatus && toStatus) {
    return `${fromStatus} -> ${toStatus}`
  }

  if (toStatus) {
    return `Moved to ${toStatus}`
  }

  return 'Status updated'
}

function mapOrderDetail(order: SellerOrderDetailApi): OrderDetailRecord {
  const shipment = order.shipment
    ? {
        status: order.shipment.status,
        ...(order.shipment.trackingNumber ? { trackingNumber: order.shipment.trackingNumber } : {}),
        ...(order.shipment.provider?.name ? { providerName: order.shipment.provider.name } : {}),
      }
    : undefined

  return {
    id: order.id,
    orderNumber: order.order.id,
    status: order.status,
    createdAt: formatDateTime(order.createdAt),
    updatedAt: formatDateTime(order.updatedAt),
    totalAmount: Number(order.totalAmount),
    subtotalAmount: Number(order.subtotal),
    shippingAmount: Number(order.shippingFee),
    itemCount: order.items.reduce((count, item) => count + item.quantity, 0),
    customer: {
      name: order.order.shippingName,
      ...(order.order.shippingPhone ? { phone: order.order.shippingPhone } : {}),
      ...(order.order.shippingAddress ? { address: order.order.shippingAddress } : {}),
    },
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      ...(item.variantLabel ? { variantLabel: item.variantLabel } : {}),
      sku: item.variant.sku,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
    })),
    ...(shipment ? { shipment } : {}),
    auditLogs: order.auditLogs.map((log) => ({
      id: log.id,
      label: formatAuditLabel(log.fromStatus, log.toStatus),
      timestamp: formatDateTime(log.createdAt),
      ...(log.note ? { note: log.note } : {}),
    })),
  }
}

export default function SellerOrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderDetailRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionInFlight, setActionInFlight] = useState<OrderDetailStatus | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)

      try {
        const response = await api<SellerOrderDetailResponse>(`/orders/${params.id}`)
        setOrder(response.data ? mapOrderDetail(response.data) : null)
      } catch {
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }

    void fetchOrder()
  }, [params.id])

  const statusActions = useMemo(
    () => (order ? buildOrderDetailStatusActions(order.status) : []),
    [order],
  )

  const handleStatusAction = async (nextStatus: OrderDetailStatus) => {
    if (!order) {
      return
    }

    setActionInFlight(nextStatus)

    try {
      const payload: UpdateOrderStatusRequest = { status: nextStatus }
      await api(`/orders/${params.id}/status`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })

      setOrder((current) =>
        current
          ? {
              ...current,
              status: nextStatus,
              updatedAt: formatDateTime(new Date().toISOString()),
              auditLogs: [
                {
                  id: `local-${Date.now()}`,
                  label: `${current.status} -> ${nextStatus}`,
                  timestamp: formatDateTime(new Date().toISOString()),
                },
                ...(current.auditLogs ?? []),
              ],
            }
          : current,
      )
    } finally {
      setActionInFlight(null)
    }
  }

  return (
    <DashboardLayout>
      <OrderDetail
        title="Order detail"
        description="Review items, buyer information, and update fulfillment progress."
        breadcrumb={[
          { label: 'Orders', href: '/orders' },
          ...(order ? [{ label: order.orderNumber }] : [{ label: params.id }]),
        ]}
        backHref="/orders"
        order={order}
        loading={loading}
        statusActions={statusActions}
        actionInFlight={actionInFlight}
        onStatusAction={handleStatusAction}
        emptyMessage="We couldn't find this order."
      />
    </DashboardLayout>
  )
}
