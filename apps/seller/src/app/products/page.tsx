'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { DataTable } from '@ecom/core-ui'
import { StatusBadge } from '../../components/status-badge'
import { api } from '../../lib/api'

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

interface ProductsResponse {
  data: Product[]
  meta: { page: number; limit: number; total: number; totalPages: number }
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
        const res = await api<{ data: ProductsResponse }>('/products', {
          params: { page, limit: 20, search: search || undefined, status: statusFilter || undefined },
        })
        setProducts(res.data.data)
        setTotalPages(res.data.meta.totalPages)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [page, search, statusFilter])

  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (row: Product) => (
        <div className="flex items-center gap-3">
          {row.images[0] ? (
            <img src={row.images[0].url} alt={row.name} className="h-10 w-10 rounded object-cover" />
          ) : (
            <div className="h-10 w-10 bg-gray-100 rounded" />
          )}
          <div>
            <div className="font-medium">{row.name}</div>
            {row.baseSku && <div className="text-xs text-gray-500">SKU: {row.baseSku}</div>}
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (row: Product) => row.category?.name ?? '—' },
    { key: 'basePrice', header: 'Price', render: (row: Product) => row.basePrice != null ? `$${row.basePrice.toFixed(2)}` : '—' },
    { key: 'baseStock', header: 'Stock', render: (row: Product) => String(row.baseStock) },
    { key: 'variants', header: 'Variants', render: (row: Product) => String(row._count.variants) },
    { key: 'status', header: 'Status', render: (row: Product) => <StatusBadge status={row.status} /> },
  ]

  return (
    <DashboardLayout>
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        actions={
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
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
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <DataTable columns={columns} data={products} loading={loading} emptyMessage="No products yet. Create your first product!" />

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
