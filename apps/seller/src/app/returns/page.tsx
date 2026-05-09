'use client'

import { useState, useEffect } from 'react'
import { Search, RotateCcw, Clock, CheckCircle } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { DataTable } from '@ecom/core-ui'
import { StatusBadge } from '../../components/status-badge'
import { StatCard } from '@ecom/core-ui'
import { api } from '../../lib/api'

interface ReturnRequest {
  id: string
  orderId: string
  reason: string
  description: string | null
  status: string
  refundAmount: number
  createdAt: string
  items: { id: string; variantId: string; quantity: number }[]
  _count: { evidence: number; timeline: number }
}

interface ReturnsResponse {
  data: ReturnRequest[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

interface ReturnStats {
  total: number
  pending: number
  approved: number
  refunded: number
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [stats, setStats] = useState<ReturnStats>({ total: 0, pending: 0, approved: 0, refunded: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [returnsRes, statsRes] = await Promise.all([
          api<ReturnsResponse>('/returns', {
            params: { page, limit: 20, search: search || undefined, status: statusFilter || undefined },
          }),
          api<ReturnStats>('/returns/stats'),
        ])
        setReturns(returnsRes.data)
        setTotalPages(returnsRes.meta.totalPages)
        setStats(statsRes)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, search, statusFilter])

  const handleUpdateStatus = async (returnId: string, status: string) => {
    try {
      await api(`/returns/${returnId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
      setPage(page)
    } catch {
      /* empty */
    }
  }

  const columns = [
    { key: 'id', header: 'Return ID', render: (row: ReturnRequest) => <span className="font-mono text-xs">{row.id.slice(0, 8)}...</span> },
    { key: 'reason', header: 'Reason', render: (row: ReturnRequest) => row.reason.replace(/_/g, ' ') },
    {
      key: 'refundAmount',
      header: 'Refund',
      render: (row: ReturnRequest) => `$${Number(row.refundAmount).toFixed(2)}`,
    },
    {
      key: 'items',
      header: 'Items',
      render: (row: ReturnRequest) => `${row.items.length} item(s)`,
    },
    { key: 'status', header: 'Status', render: (row: ReturnRequest) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: ReturnRequest) => {
        if (row.status === 'REQUESTED') {
          return (
            <div className="flex gap-1">
              <button onClick={() => handleUpdateStatus(row.id, 'REVIEWING')} className="text-blue-600 text-xs hover:underline">Review</button>
            </div>
          )
        }
        if (row.status === 'REVIEWING') {
          return (
            <div className="flex gap-1">
              <button onClick={() => handleUpdateStatus(row.id, 'APPROVED')} className="text-green-600 text-xs hover:underline">Approve</button>
              <button onClick={() => handleUpdateStatus(row.id, 'REJECTED')} className="text-red-600 text-xs hover:underline">Reject</button>
            </div>
          )
        }
        return null
      },
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row: ReturnRequest) => new Date(row.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Returns & Refunds" description="Manage return requests and refunds" />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Returns" value={stats.total} icon={RotateCcw} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} />
        <StatCard title="Approved" value={stats.approved} icon={CheckCircle} />
        <StatCard title="Refunded" value={stats.refunded} icon={CheckCircle} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search returns..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        >
          <option value="">All Status</option>
          <option value="REQUESTED">Requested</option>
          <option value="REVIEWING">Reviewing</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="RETURN_SHIPPING">Return Shipping</option>
          <option value="RECEIVED">Received</option>
          <option value="REFUNDED">Refunded</option>
        </select>
      </div>

      <DataTable columns={columns} data={returns} loading={loading} emptyMessage="No return requests" />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Previous</button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </DashboardLayout>
  )
}
