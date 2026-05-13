'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Tag, Percent, DollarSign } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { DataTable } from '@ecom/core-ui'
import { StatusBadge } from '../../components/status-badge'
import { StatCard } from '@ecom/core-ui'
import { api } from '../../lib/api'
import type { SellerPaths } from '@ecom/contracts/generated'

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

interface CouponStats {
  total: number
  active: number
  totalUsages: number
}

type CouponsListResponse =
  SellerPaths['/coupons']['get']['responses']['200']['content']['application/json']
type CouponStatsResponse =
  SellerPaths['/coupons/stats']['get']['responses']['200']['content']['application/json']

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

const getStats = (value: CouponStatsResponse): CouponStats => {
  const data = (value as { data?: unknown }).data
  if (data && typeof data === 'object') {
    const stats = data as Partial<CouponStats>
    if (
      typeof stats.total === 'number' &&
      typeof stats.active === 'number' &&
      typeof stats.totalUsages === 'number'
    ) {
      return stats as CouponStats
    }
  }

  return value as unknown as CouponStats
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
          api<CouponsListResponse>('/coupons', {
            params: {
              page,
              limit: 20,
              ...(search ? { search } : {}),
              ...(statusFilter ? { status: statusFilter } : {}),
            },
          }),
          api<CouponStatsResponse>('/coupons/stats'),
        ])
        setCoupons(getItems<Coupon>(couponsRes.data))
        setTotalPages(getTotalPages(couponsRes.meta) ?? 1)
        setStats(getStats(statsRes))
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    void fetchData()
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
        <span className="text-sm">
          {row.usageCount}
          {row.usageLimit ? `/${row.usageLimit}` : ''}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      header: 'Expires',
      render: (row: Coupon) =>
        row.expiresAt ? new Date(row.expiresAt).toLocaleDateString() : 'Never',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Coupon) => <StatusBadge status={row.status} />,
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader
        title="Coupons & Promotions"
        description="Manage your discount coupons and promotions"
        actions={
          <Link
            href="/coupons/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create Coupon
          </Link>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Coupons" value={stats.total} icon={Tag} />
        <StatCard title="Active Coupons" value={stats.active} icon={Percent} />
        <StatCard title="Total Usages" value={stats.totalUsages} icon={DollarSign} />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupons..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="EXPIRED">Expired</option>
          <option value="SCHEDULED">Scheduled</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={coupons}
        loading={loading}
        emptyMessage="No coupons yet. Create your first coupon!"
      />

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
