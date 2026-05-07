'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { DataTable } from '../../components/data-table'
import { StatusBadge } from '../../components/status-badge'
import { api } from '../../lib/api'

interface Approval {
  id: string
  productId: string
  status: string
  version: number
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
  history: { id: string; fromStatus: string; toStatus: string; note: string | null; createdAt: string }[]
}

interface ApprovalsResponse {
  data: Approval[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await api<ApprovalsResponse>('/approvals', {
          params: { page, limit: 20, status: statusFilter || undefined },
        })
        setApprovals(res.data)
        setTotalPages(res.meta.totalPages)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, statusFilter])

  const handleResubmit = async (approvalId: string) => {
    try {
      await api(`/approvals/${approvalId}/resubmit`, { method: 'POST' })
      setPage(page)
    } catch {
      /* empty */
    }
  }

  const columns = [
    {
      key: 'productId',
      header: 'Product ID',
      render: (row: Approval) => <span className="font-mono text-xs">{row.productId.slice(0, 8)}...</span>,
    },
    { key: 'version', header: 'Version', render: (row: Approval) => `v${row.version}` },
    { key: 'status', header: 'Status', render: (row: Approval) => <StatusBadge status={row.status} /> },
    {
      key: 'rejectionReason',
      header: 'Rejection Reason',
      render: (row: Approval) => row.rejectionReason ?? '—',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: Approval) => {
        if (row.status === 'REJECTED' || row.status === 'REVISION_REQUESTED') {
          return (
            <button
              onClick={() => handleResubmit(row.id)}
              className="text-blue-600 text-xs hover:underline"
            >
              Resubmit
            </button>
          )
        }
        return null
      },
    },
    {
      key: 'createdAt',
      header: 'Submitted',
      render: (row: Approval) => new Date(row.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Product Approvals" description="Track product approval status" />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        >
          <option value="">All Status</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="REVISION_REQUESTED">Revision Requested</option>
        </select>
      </div>

      <DataTable columns={columns} data={approvals} loading={loading} emptyMessage="No approval requests" />

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
