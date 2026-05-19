'use client'

import { useState, useEffect } from 'react'
import {
  Orders,
  buildOrderStatusCounts,
  type OrderRow,
  type OrdersStatusTab,
} from '@ecom/ui-seller'
import type { PaginationMeta } from '@ecom/shared/pagination/core'
import { DashboardLayout } from '../../components/dashboard-layout'
import { api } from '../../lib/api'
import type { SellerPaths } from '@ecom/contracts/generated'

interface SellerOrder {
  id: string
  status: string
  totalAmount: number
  createdAt: string
  order: { id: string; shippingName: string; shippingPhone: string }
  items: Array<{
    id: string
    productName: string
    variantLabel: string | null
  }>
  _count: { items: number }
}

type OrdersListResponse =
  SellerPaths['/orders']['get']['responses']['200']['content']['application/json']

const STATUS_TO_QUERY: Record<Exclude<OrdersStatusTab, 'ALL'>, string> = {
  TO_PAY: 'PENDING',
  TO_SHIP: 'CONFIRMED',
  PACKING: 'PACKING',
  SHIPPING: 'SHIPPED',
  COMPLETED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
}

const getItems = <T,>(data: unknown): T[] => {
  if (!data || typeof data !== 'object') return []
  const items = (data as { items?: unknown }).items
  if (Array.isArray(items)) return items as T[]
  const nested = (data as { data?: unknown }).data
  if (Array.isArray(nested)) return nested as T[]
  return []
}

const getTotalPages = (meta: unknown): number | undefined => {
  if (!meta || typeof meta !== 'object') return undefined
  const pagination = (meta as { pagination?: unknown }).pagination
  if (pagination && typeof pagination === 'object') {
    const totalPages = (pagination as { totalPages?: unknown }).totalPages
    if (typeof totalPages === 'number') return totalPages
  }
  const totalPages = (meta as { totalPages?: unknown }).totalPages
  return typeof totalPages === 'number' ? totalPages : undefined
}

const getTotal = (meta: unknown): number => {
  if (!meta || typeof meta !== 'object') return 0
  const pagination = (meta as { pagination?: unknown }).pagination
  if (pagination && typeof pagination === 'object') {
    const total = (pagination as { total?: unknown }).total
    if (typeof total === 'number') return total
  }
  const total = (meta as { total?: unknown }).total
  return typeof total === 'number' ? total : 0
}

const getLimit = (meta: unknown, fallback: number): number => {
  if (!meta || typeof meta !== 'object') return fallback
  const pagination = (meta as { pagination?: unknown }).pagination
  if (pagination && typeof pagination === 'object') {
    const limit = (pagination as { limit?: unknown }).limit
    if (typeof limit === 'number') return limit
  }
  const limit = (meta as { limit?: unknown }).limit
  return typeof limit === 'number' ? limit : fallback
}

const getHasNextPage = (meta: unknown): boolean => {
  if (!meta || typeof meta !== 'object') return false
  const pagination = (meta as { pagination?: unknown }).pagination
  if (pagination && typeof pagination === 'object') {
    const value = (pagination as { hasNextPage?: unknown }).hasNextPage
    if (typeof value === 'boolean') return value
  }
  const value = (meta as { hasNextPage?: unknown }).hasNextPage
  return typeof value === 'boolean' ? value : false
}

const getHasPreviousPage = (meta: unknown): boolean => {
  if (!meta || typeof meta !== 'object') return false
  const pagination = (meta as { pagination?: unknown }).pagination
  if (pagination && typeof pagination === 'object') {
    const value = (pagination as { hasPreviousPage?: unknown }).hasPreviousPage
    if (typeof value === 'boolean') return value
  }
  const value = (meta as { hasPreviousPage?: unknown }).hasPreviousPage
  return typeof value === 'boolean' ? value : false
}

function mapOrderStatus(status: string): Exclude<OrdersStatusTab, 'ALL'> {
  switch (status) {
    case 'PENDING':
      return 'TO_PAY'
    case 'CONFIRMED':
      return 'TO_SHIP'
    case 'PACKING':
      return 'PACKING'
    case 'SHIPPED':
      return 'SHIPPING'
    case 'DELIVERED':
      return 'COMPLETED'
    case 'CANCELLED':
      return 'CANCELLED'
    default:
      return 'TO_PAY'
  }
}

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function mapOrders(orders: SellerOrder[]): OrderRow[] {
  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.order.id,
    buyerName: order.order.shippingName,
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      ...(item.variantLabel ? { variantLabel: item.variantLabel } : {}),
    })),
    itemCount: order._count.items,
    total: Number(order.totalAmount),
    status: mapOrderStatus(order.status),
    createdAtLabel: formatDateLabel(order.createdAt),
    href: `/orders/${order.id}`,
  }))
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OrdersStatusTab>('ALL')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<PaginationMeta | undefined>()

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const statusFilter = status === 'ALL' ? undefined : STATUS_TO_QUERY[status]
        const limit = 20
        const res = await api<OrdersListResponse>('/orders', {
          params: {
            page,
            limit,
            ...(search ? { search } : {}),
            ...(statusFilter ? { status: statusFilter } : {}),
          },
        })
        const items = getItems<SellerOrder>(res.data)
        setOrders(mapOrders(items))

        const totalPages = getTotalPages(res.meta) ?? 1
        setMeta({
          total: getTotal(res.meta),
          page,
          limit: getLimit(res.meta, limit),
          totalPages,
          hasNextPage: getHasNextPage(res.meta),
          hasPreviousPage: getHasPreviousPage(res.meta),
        })
      } catch {
        setOrders([])
        setMeta(undefined)
      } finally {
        setLoading(false)
      }
    }
    void fetchOrders()
  }, [page, search, status])

  const statusCounts = buildOrderStatusCounts(orders)

  return (
    <DashboardLayout>
      <Orders
        loading={loading}
        orders={orders}
        status={status}
        onStatusChange={(nextStatus) => {
          setStatus(nextStatus)
          setPage(1)
        }}
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        statusCounts={statusCounts}
        emptyMessage={loading ? 'Loading orders...' : 'No orders yet'}
        {...(meta ? { meta } : {})}
        onPageChange={setPage}
      />
    </DashboardLayout>
  )
}
