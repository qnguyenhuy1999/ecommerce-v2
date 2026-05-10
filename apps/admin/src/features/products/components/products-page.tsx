'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { createColumnHelper } from '@tanstack/react-table'
import { ProductStatus } from '@ecom/contracts'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { DataTable, StatusBadge, TableToolbar, StatusTabs } from '@ecom/core-ui'
import {
  useProducts,
  useProductStatusCounts,
  useBulkApproveProducts,
  useBulkRejectProducts,
} from '../hooks/use-products'
import type { ProductListItem } from '../api/products.api'

const col = createColumnHelper<ProductListItem>()

const columns = [
  col.display({
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  col.accessor('name', {
    header: 'Product',
    cell: (info) => (
      <Link href={`/products/${info.row.original.id}`} className="font-medium hover:underline">
        {info.getValue()}
      </Link>
    ),
  }),
  col.accessor('shop.name', { header: 'Seller' }),
  col.accessor((row) => row.category?.name ?? '—', { id: 'category', header: 'Category' }),
  col.accessor('basePrice', {
    header: 'Price',
    cell: (info) => (info.getValue() ? `$${Number(info.getValue()).toFixed(2)}` : '—'),
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  col.accessor('createdAt', {
    header: 'Created',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
]

const STATUS_TABS: string[] = ['ALL', ...(Object.values(ProductStatus) as string[])]

export function ProductsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selected, setSelected] = useState<ProductListItem[]>([])

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const debounce = useCallback((value: string) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(value)
      setPage(1)
    }, 300)
  }, [])

  const { data, isLoading } = useProducts({
    page,
    limit: PAGINATION_DEFAULTS.PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  })
  const { data: counts } = useProductStatusCounts()
  const bulkApprove = useBulkApproveProducts()
  const bulkReject = useBulkRejectProducts()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground">Moderate marketplace products</p>
      </div>

      <StatusTabs
        tabs={STATUS_TABS}
        value={statusFilter}
        onChange={(t) => {
          setStatusFilter(t)
          setPage(1)
        }}
        counts={counts}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        meta={data?.meta}
        loading={isLoading}
        onPageChange={setPage}
        enableRowSelection
        onSelectionChange={setSelected}
        toolbar={
          <TableToolbar
            search={search}
            onSearchChange={(v) => {
              setSearch(v)
              debounce(v)
            }}
            placeholder="Search products..."
          />
        }
        bulkActions={
          <>
            <button
              onClick={() => bulkApprove.mutate(selected.map((s) => s.id))}
              className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => bulkReject.mutate(selected.map((s) => s.id))}
              className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
            >
              Reject
            </button>
          </>
        }
      />
    </div>
  )
}
