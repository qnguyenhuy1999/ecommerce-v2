'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Tag, Percent, DollarSign } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { DataTable } from '../../components/data-table'
import { StatusBadge } from '../../components/status-badge'
import { StatCard } from '../../components/stat-card'
import { api } from '../../lib/api'

interface Coupon {
  id: string
  code: string
  name: string
  type: string
  discountValue: number
  status: string
  usageCount: number
  usageLimit: number | null
  startsAt: string
  expiresAt: string | null
}

interface CouponsResponse {
  data: Coupon[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

interface CouponStats {
  total: number
  active: number
  totalUsages: number
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [stats, setStats] = useState<CouponStats>({ total: 0, active: 0, totalUsages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [couponsRes, statsRes] = await Promise.all([
          api<CouponsResponse>('/coupons', {
            params: { page, limit: 20, search: search || undefined, status: statusFilter || undefined },
          }),
          api<CouponStats>('/coupons/stats'),
        ])
        setCoupons(couponsRes.data)
        setTotalPages(couponsRes.meta.totalPages)
        setStats(statsRes)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, search, statusFilter])

  const columns = [
    {
      key: 'code',
      header: 'Code',
      render: (row: Coupon) => <span className="font-mono font-medium">{row.code}</span>,
    },
    { key: 'name', header: 'Name' },
    {
      key: 'type',
      header: 'Type',
      render: (row: Coupon) => (
        <span className="text-sm">
          {row.type === 'PERCENTAGE' ? `${row.discountValue}%` : `$${row.discountValue}`}
        </span>
      ),
    },
    {
      key: 'usage',
      header: 'Usage',
      render: (row: Coupon) => (
        <span className="text-sm">{row.usageCount}{row.usageLimit ? `/${row.usageLimit}` : ''}</span>
      ),
    },
    {
      key: 'expiresAt',
      header: 'Expires',
      render: (row: Coupon) => row.expiresAt ? new Date(row.expiresAt).toLocaleDateString() : 'Never',
    },
    { key: 'status', header: 'Status', render: (row: Coupon) => <StatusBadge status={row.status} /> },
  ]

  return (
    <DashboardLayout>
      <PageHeader
        title="Coupons & Promotions"
        description="Manage your discount coupons and promotions"
        actions={
          <Link
            href="/coupons/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Coupon
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Coupons" value={stats.total} icon={Tag} />
        <StatCard title="Active Coupons" value={stats.active} icon={Percent} />
        <StatCard title="Total Usages" value={stats.totalUsages} icon={DollarSign} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupons..."
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
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="EXPIRED">Expired</option>
          <option value="SCHEDULED">Scheduled</option>
        </select>
      </div>

      <DataTable columns={columns} data={coupons} loading={loading} emptyMessage="No coupons yet. Create your first coupon!" />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
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
