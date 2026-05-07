'use client'

import { useState, useEffect } from 'react'
import { Search, AlertTriangle } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { DataTable } from '../../components/data-table'
import { api } from '../../lib/api'

interface InventoryItem {
  variantId: string
  productId: string
  productName: string
  sku: string | null
  stock: number
  reservedStock: number
  availableStock: number
  isLowStock: boolean
  options: { group: string; value: string }[]
}

interface InventoryResponse {
  data: InventoryItem[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true)
      try {
        const res = await api<{ data: InventoryResponse }>('/inventory', {
          params: { page, limit: 20, search: search || undefined, lowStock: lowStockOnly || undefined },
        })
        setItems(res.data.data)
        setTotalPages(res.data.meta.totalPages)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchInventory()
  }, [page, search, lowStockOnly])

  const columns = [
    {
      key: 'product',
      header: 'Product',
      render: (row: InventoryItem) => (
        <div>
          <div className="font-medium">{row.productName}</div>
          {row.options.length > 0 && (
            <div className="text-xs text-gray-500">
              {row.options.map((o) => `${o.group}: ${o.value}`).join(', ')}
            </div>
          )}
        </div>
      ),
    },
    { key: 'sku', header: 'SKU', render: (row: InventoryItem) => row.sku ?? '—' },
    { key: 'stock', header: 'Total Stock', render: (row: InventoryItem) => String(row.stock) },
    { key: 'reserved', header: 'Reserved', render: (row: InventoryItem) => String(row.reservedStock) },
    {
      key: 'available',
      header: 'Available',
      render: (row: InventoryItem) => (
        <span className={row.isLowStock ? 'text-red-600 font-medium' : ''}>
          {row.availableStock}
          {row.isLowStock && <AlertTriangle className="inline ml-1 h-3 w-3" />}
        </span>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Inventory" description="Monitor and manage stock levels" />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product or SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
        <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => { setLowStockOnly(e.target.checked); setPage(1) }}
            className="rounded border-gray-300"
          />
          Low stock only
        </label>
      </div>

      <DataTable columns={columns} data={items} loading={loading} emptyMessage="No inventory items found" />

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
