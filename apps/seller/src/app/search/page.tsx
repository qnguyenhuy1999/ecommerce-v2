/* eslint-disable max-lines-per-function */
'use client'

import { useState, useEffect } from 'react'
import { Search as SearchIcon, Filter, Bookmark, X } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { DataTable } from '@ecom/core-ui'
import { StatusBadge } from '../../components/status-badge'
import { api } from '../../lib/api'

interface ProductResult {
  id: string
  name: string
  status: string
  images: { url: string }[]
  variants: { id: string; sku: string; price: number; stock: number }[]
  category: { id: string; name: string } | null
}

interface SearchResponse {
  data: ProductResult[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

interface SavedFilter {
  id: string
  name: string
  entity: string
  filters: Record<string, unknown>
  createdAt: string
}

export default function SearchPage() {
  const [results, setResults] = useState<ProductResult[]>([])
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [sku, setSku] = useState('')
  const [status, setStatus] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    api<SavedFilter[]>('/search/filters', { params: { entity: 'product' } })
      .then(setSavedFilters)
      .catch(() => {})
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const res = await api<SearchResponse>('/search/products', {
        params: {
          page,
          limit: 20,
          q: query || undefined,
          sku: sku || undefined,
          status: status || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
        },
      })
      setResults(res.data)
      setTotalPages(res.meta.totalPages)
    } catch {
      /* empty */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [page])

  const handleSaveFilter = async () => {
    if (!filterName.trim()) return
    try {
      await api('/search/filters', {
        method: 'POST',
        body: JSON.stringify({
          name: filterName,
          entity: 'product',
          filters: { q: query, sku, status, minPrice, maxPrice },
        }),
      })
      setFilterName('')
      const filters = await api<SavedFilter[]>('/search/filters', { params: { entity: 'product' } })
      setSavedFilters(filters)
    } catch {
      /* empty */
    }
  }

  const handleLoadFilter = (filter: SavedFilter) => {
    const f = filter.filters as Record<string, string>
    setQuery(f.q ?? '')
    setSku(f.sku ?? '')
    setStatus(f.status ?? '')
    setMinPrice(f.minPrice ?? '')
    setMaxPrice(f.maxPrice ?? '')
    setPage(1)
  }

  const handleDeleteFilter = async (filterId: string) => {
    try {
      await api(`/search/filters/${filterId}`, { method: 'DELETE' })
      setSavedFilters((prev) => prev.filter((f) => f.id !== filterId))
    } catch {
      /* empty */
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (row: ProductResult) => (
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
            {row.variants[0]?.sku && (
              <div className="text-xs text-gray-500">SKU: {row.variants[0].sku}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row: ProductResult) => row.category?.name ?? '—',
    },
    {
      key: 'price',
      header: 'Price',
      render: (row: ProductResult) =>
        row.variants[0] ? `$${Number(row.variants[0].price).toFixed(2)}` : '—',
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (row: ProductResult) => {
        const total = row.variants.reduce((s, v) => s + v.stock, 0)
        return String(total)
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: ProductResult) => <StatusBadge status={row.status} />,
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Search & Filter" description="Advanced product search and filtering" />

      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            onClick={handleSearch}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {showFilters && (
          <div className="space-y-3 border-t border-gray-200 pt-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <input
                type="text"
                placeholder="SKU"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Filter name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSaveFilter}
                className="inline-flex items-center gap-1 rounded border border-blue-300 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50"
              >
                <Bookmark className="h-3 w-3" /> Save Filter
              </button>
            </div>
          </div>
        )}

        {savedFilters.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {savedFilters.map((f) => (
              <div
                key={f.id}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs"
              >
                <button onClick={() => handleLoadFilter(f)} className="hover:text-blue-600">
                  {f.name}
                </button>
                <button
                  onClick={() => handleDeleteFilter(f.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={results}
        loading={loading}
        emptyMessage="No products found. Try a different search."
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
