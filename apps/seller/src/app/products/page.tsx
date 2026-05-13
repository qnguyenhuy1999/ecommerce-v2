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

interface Product {
  id: string
  name: string
  baseSku: string | null
  basePrice: number | null
  baseStock: number
  status: string
  createdAt: string
  images: { url: string }[]
  category: { name: string } | null
  _count: { variants: number }
}

type ProductsListResponse =
  SellerPaths['/products']['get']['responses']['200']['content']['application/json']

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await api<ProductsListResponse>('/products', {
          params: {
            page,
            limit: 20,
            ...(search ? { search } : {}),
            ...(statusFilter ? { status: statusFilter } : {}),
          },
        })
        setProducts(getItems<Product>(res.data))
        setTotalPages(getTotalPages(res.meta) ?? 1)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    void fetchProducts()
  }, [page, search, statusFilter])

  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (row: Product) => (
        <div className="flex items-center gap-3">
          {row.images[0] ? (
            <img
              src={row.images[0].url}
              alt={row.name}
              className="h-10 w-10 rounded object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded bg-gray-100" />
          )}
          <div>
            <div className="font-medium">{row.name}</div>
            {row.baseSku && <div className="text-xs text-gray-500">SKU: {row.baseSku}</div>}
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (row: Product) => row.category?.name ?? '—' },
    {
      key: 'basePrice',
      header: 'Price',
      render: (row: Product) => (row.basePrice != null ? `$${row.basePrice.toFixed(2)}` : '—'),
    },
    { key: 'baseStock', header: 'Stock', render: (row: Product) => String(row.baseStock) },
    { key: 'variants', header: 'Variants', render: (row: Product) => String(row._count.variants) },
    {
      key: 'status',
      header: 'Status',
      render: (row: Product) => <StatusBadge status={row.status} />,
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        actions={
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
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
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyMessage="No products yet. Create your first product!"
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
