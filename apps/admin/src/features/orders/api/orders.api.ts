import { apiFetch } from '@/lib/api'
import type { AdminOperations } from '@ecom/contracts/generated'
import type { PaginatedResponse } from '@ecom/shared/pagination/core'

export interface OrderListItem {
  id: string
  status: string
  totalAmount: string
  createdAt: string
  sellerOrders: {
    id: string
    shop: { id: string; name: string }
    _count: { items: number }
  }[]
}

export interface OrderDetail extends Omit<OrderListItem, 'sellerOrders'> {
  sellerOrders: {
    id: string
    status: string
    subtotal: string
    shop: { id: string; name: string }
    items: {
      id: string
      productName: string
      quantity: number
      unitPrice: string
      totalPrice: string
    }[]
    shipment: { id: string; status: string; trackingNumber: string | null } | null
    auditLogs: { id: string; action: string; note: string | null; createdAt: string }[]
  }[]
}

type OrderListQuery = NonNullable<
  AdminOperations['OrdersController_findAll']['parameters']['query']
>
export type { OrderListQuery }
type OrderListResponse =
  AdminOperations['OrdersController_findAll']['responses']['200']['content']['application/json'] & {
    data: PaginatedResponse<OrderListItem>
  }
type OrderDetailResponse =
  AdminOperations['OrdersController_findById']['responses']['200']['content']['application/json'] & {
    data: OrderDetail
  }
type OrderStatusCountsResponse =
  AdminOperations['OrdersController_statusCounts']['responses']['200']['content']['application/json'] & {
    data: Record<string, number>
  }
type OrderActionBody =
  AdminOperations['OrdersController_forceCancel']['requestBody']['content']['application/json']
type OrderActionResponse =
  AdminOperations['OrdersController_forceCancel']['responses']['200']['content']['application/json']

export async function getOrders(params: OrderListQuery = {}) {
  const query: OrderListQuery = {
    ...(params.page !== undefined && { page: params.page }),
    ...(params.limit !== undefined && { limit: params.limit }),
    ...(params.search !== undefined && { search: params.search }),
    ...(params.status !== undefined && { status: params.status }),
    ...(params.buyerId !== undefined && { buyerId: params.buyerId }),
  }

  return apiFetch<OrderListResponse>('/admin/orders', { params: query })
}

export async function getOrder(id: string) {
  return apiFetch<OrderDetailResponse>(`/admin/orders/${id}`)
}

export async function getOrderStatusCounts() {
  return apiFetch<OrderStatusCountsResponse>('/admin/orders/status-counts')
}

export async function forceCancelOrder(id: string, reason?: string) {
  const body: OrderActionBody = {
    ...(reason !== undefined && { reason }),
  }

  return apiFetch<OrderActionResponse>(`/admin/orders/${id}/force-cancel`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function forceCompleteOrder(id: string) {
  return apiFetch<OrderActionResponse>(`/admin/orders/${id}/force-complete`, { method: 'POST' })
}
