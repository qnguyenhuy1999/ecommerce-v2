'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { createColumnHelper } from '@tanstack/react-table'
import { OrderStatus } from '@ecom/contracts'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { DataTable, StatusBadge, TableToolbar, StatusTabs } from '@ecom/core-ui'
import { useOrders, useOrderStatusCounts } from '../hooks/use-orders'
import type { OrderListItem } from '../api/orders.api'

const col = createColumnHelper<OrderListItem>()

const columns = [
  col.accessor('id', {
    header: 'Order ID',
    cell: (info) => (
      <Link
        href={`/orders/${info.getValue()}`}
        className="font-mono text-xs font-medium hover:underline"
      >
        {info.getValue().slice(0, 8)}...
      </Link>
    ),
  }),
  col.accessor('totalAmount', {
    header: 'Total',
    cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  col.accessor((row) => row.sellerOrders.length, { id: 'sellers', header: 'Sellers' }),
  col.accessor('createdAt', {
    header: 'Created',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
]

type OrderStatusFilter = (typeof OrderStatus)[keyof typeof OrderStatus] | 'ALL'

const STATUS_TABS: OrderStatusFilter[] = ['ALL', ...Object.values(OrderStatus)]

function isOrderStatusFilter(value: string): value is OrderStatusFilter {
  return value === 'ALL' || Object.values(OrderStatus).some((status) => status === value)
}

export function OrdersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('ALL')

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const debounce = useCallback((value: string) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(value)
      setPage(1)
    }, 300)
  }, [])

  const { data, isLoading } = useOrders({
    page,
    limit: PAGINATION_DEFAULTS.PAGE_SIZE,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
  })
  const { data: counts } = useOrderStatusCounts()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm">Manage marketplace orders</p>
      </div>

      <StatusTabs
        tabs={STATUS_TABS}
        value={statusFilter}
        onChange={(t) => {
          if (isOrderStatusFilter(t)) {
            setStatusFilter(t)
            setPage(1)
          }
        }}
        {...(counts !== undefined ? { counts } : {})}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        {...(data?.meta !== undefined ? { meta: data.meta } : {})}
        loading={isLoading}
        onPageChange={(p) => setPage(p)}
        toolbar={
          <TableToolbar
            search={search}
            onSearchChange={(v) => {
              setSearch(v)
              debounce(v)
            }}
            placeholder="Search orders..."
          />
        }
      />
    </div>
  )
}
