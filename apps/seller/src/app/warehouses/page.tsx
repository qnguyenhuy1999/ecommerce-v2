'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { DataTable } from '@ecom/core-ui'
import { StatusBadge } from '../../components/status-badge'
import { api } from '../../lib/api'
import type { SellerPaths } from '@ecom/contracts/generated'

interface WarehouseItem {
  id: string
  name: string
  code: string
  address: string | null
  isActive: boolean
  isDefault: boolean
  createdAt: string
  _count: { stocks: number }
}

interface WarehousesResponse {
  data: WarehouseItem[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

type WarehousesListResponse =
  SellerPaths['/warehouses']['get']['responses']['200']['content']['application/json'] &
    WarehousesResponse

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await api<WarehousesListResponse>('/warehouses', {
          params: {
            page,
            limit: 20,
            ...(search ? { search } : {}),
          },
        })
        setWarehouses(res.data)
        setTotalPages(res.meta.totalPages)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, search])

  const columns = [
    {
      key: 'name',
      header: 'Warehouse',
      render: (row: WarehouseItem) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.code}</div>
        </div>
      ),
    },
    { key: 'address', header: 'Address', render: (row: WarehouseItem) => row.address ?? '—' },
    { key: 'stocks', header: 'SKUs', render: (row: WarehouseItem) => String(row._count.stocks) },
    {
      key: 'isDefault',
      header: 'Default',
      render: (row: WarehouseItem) =>
        row.isDefault ? <span className="text-sm font-medium text-green-600">Yes</span> : '—',
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row: WarehouseItem) => <StatusBadge status={row.isActive ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row: WarehouseItem) => new Date(row.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader
        title="Warehouses"
        description="Manage your warehouses and inventory locations"
        actions={
          <Link
            href="/warehouses/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Warehouse
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search warehouses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={warehouses}
        loading={loading}
        emptyMessage="No warehouses yet. Create your first warehouse!"
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
