'use client'

import { useState, useEffect } from 'react'
import { Upload, Download } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { DataTable } from '@ecom/core-ui'
import { StatusBadge } from '../../components/status-badge'
import { api } from '../../lib/api'

interface BulkJob {
  id: string
  type: string
  status: string
  fileName: string
  totalRows: number | null
  processedRows: number | null
  successRows: number | null
  errorRows: number | null
  createdAt: string
  completedAt: string | null
}

interface BulkJobsResponse {
  data: BulkJob[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

export default function BulkPage() {
  const [jobs, setJobs] = useState<BulkJob[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const res = await api<BulkJobsResponse>('/bulk/jobs', {
          params: { page, limit: 20, type: typeFilter || undefined },
        })
        setJobs(res.data)
        setTotalPages(res.meta.totalPages)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [page, typeFilter])

  const handleExport = async () => {
    try {
      await api('/bulk/export', {
        method: 'POST',
        body: JSON.stringify({ fileName: `products-export-${Date.now()}.csv` }),
      })
      setPage(1)
    } catch {
      /* empty */
    }
  }

  const columns = [
    { key: 'fileName', header: 'File Name' },
    {
      key: 'type',
      header: 'Type',
      render: (row: BulkJob) => row.type.replace(/_/g, ' '),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: BulkJob) => <StatusBadge status={row.status} />,
    },
    {
      key: 'progress',
      header: 'Progress',
      render: (row: BulkJob) => {
        if (row.processedRows === null) return '—'
        return `${row.successRows ?? 0} / ${row.processedRows} (${row.errorRows ?? 0} errors)`
      },
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row: BulkJob) => new Date(row.createdAt).toLocaleString(),
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader
        title="Bulk Operations"
        description="Import and export products in bulk"
        actions={
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Products
            </button>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              Import Products
              <input type="file" accept=".csv,.xlsx" className="hidden" />
            </label>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value)
            setPage(1)
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        >
          <option value="">All Types</option>
          <option value="PRODUCT_IMPORT">Product Import</option>
          <option value="PRODUCT_EXPORT">Product Export</option>
          <option value="INVENTORY_UPDATE">Inventory Update</option>
          <option value="PRICE_UPDATE">Price Update</option>
        </select>
      </div>

      <DataTable columns={columns} data={jobs} loading={loading} emptyMessage="No bulk jobs yet" />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </DashboardLayout>
  )
}
