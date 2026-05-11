'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { DataTable } from '@ecom/core-ui'
import { StatusBadge } from '../../components/status-badge'
import { api } from '../../lib/api'

interface SellerOrder {
  id: string
  status: string
  totalAmount: number
  createdAt: string
  order: { id: string; shippingName: string; shippingPhone: string }
  _count: { items: number }
}

interface OrdersResponse {
  data: SellerOrder[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await api<{ data: OrdersResponse }>('/orders', {
          params: {
            page,
            limit: 20,
            search: search || undefined,
            status: statusFilter || undefined,
          },
        })
        setOrders(res.data.data)
        setTotalPages(res.data.meta.totalPages)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [page, search, statusFilter])

  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      render: (row: SellerOrder) => (
        <span className="font-mono text-xs">{row.id.slice(0, 8)}...</span>
      ),
    },
    { key: 'customer', header: 'Customer', render: (row: SellerOrder) => row.order.shippingName },
    { key: 'items', header: 'Items', render: (row: SellerOrder) => String(row._count.items) },
    {
      key: 'totalAmount',
      header: 'Total',
      render: (row: SellerOrder) => `$${row.totalAmount.toFixed(2)}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: SellerOrder) => <StatusBadge status={row.status} />,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row: SellerOrder) => new Date(row.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Orders" description="Manage your seller orders" />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PACKING">Packing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <DataTable columns={columns} data={orders} loading={loading} emptyMessage="No orders yet" />

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </DashboardLayout>
  )
}
