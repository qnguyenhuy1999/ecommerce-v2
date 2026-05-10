'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createColumnHelper } from '@tanstack/react-table'
import { RefundStatus } from '@ecom/contracts'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { DataTable, StatusBadge, StatusTabs } from '@ecom/core-ui'
import { useRefunds, useRefundStatusCounts } from '../hooks/use-refunds'
import type { RefundListItem } from '../api/refunds.api'

const col = createColumnHelper<RefundListItem>()

const columns = [
  col.accessor('id', {
    header: 'Request ID',
    cell: (info) => (
      <Link
        href={`/refunds/${info.getValue()}`}
        className="font-medium hover:underline font-mono text-xs"
      >
        {info.getValue().slice(0, 8)}...
      </Link>
    ),
  }),
  col.accessor('reason', { header: 'Reason' }),
  col.accessor('refundAmount', {
    header: 'Amount',
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

const STATUS_TABS: string[] = ['ALL', ...(Object.values(RefundStatus) as string[])]

export function RefundsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('ALL')

  const { data, isLoading } = useRefunds({
    page,
    limit: PAGINATION_DEFAULTS.PAGE_SIZE,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  })
  const { data: counts } = useRefundStatusCounts()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Refunds</h1>
        <p className="text-sm text-muted-foreground">Manage return requests & refunds</p>
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
      />
    </div>
  )
}
