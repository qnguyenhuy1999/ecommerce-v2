'use client'

import { useState, useCallback, useRef } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { CouponStatus, CouponType } from '@ecom/contracts'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { DataTable, StatusBadge, TableToolbar, StatusTabs } from '@ecom/core-ui'
import { useVouchers, useVoucherStatusCounts, useCreateVoucher } from '../hooks/use-promotions'
import type { VoucherListItem } from '../api/promotions.api'

const col = createColumnHelper<VoucherListItem>()

const columns = [
  col.accessor('code', {
    header: 'Code',
    cell: (info) => <span className="font-mono font-medium">{info.getValue()}</span>,
  }),
  col.accessor('name', { header: 'Name' }),
  col.accessor('type', {
    header: 'Type',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  col.accessor('discountValue', {
    header: 'Discount',
    cell: (info) => {
      const row = info.row.original
      return row.type === 'PERCENTAGE'
        ? `${info.getValue()}%`
        : `$${Number(info.getValue()).toFixed(2)}`
    },
  }),
  col.accessor('usedCount', {
    header: 'Usage',
    cell: (info) => {
      const limit = info.row.original.usageLimit
      return `${info.getValue()}${limit ? ` / ${limit}` : ''}` // eslint-disable-line sonarjs/no-nested-template-literals
    },
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  col.accessor('expiresAt', {
    header: 'Expires',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
]

const STATUS_TABS: string[] = ['ALL', ...(Object.values(CouponStatus) as string[])]

export function VouchersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const createVoucher = useCreateVoucher()

  const [form, setForm] = useState({
    code: '',
    name: '',
    type: CouponType.PERCENTAGE as CouponType,
    discountValue: '',
    minOrderAmount: '',
    usageLimit: '',
    startsAt: '',
    expiresAt: '',
  })

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const debounce = useCallback((value: string) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(value)
      setPage(1)
    }, 300)
  }, [])

  const { data, isLoading } = useVouchers({
    page,
    limit: PAGINATION_DEFAULTS.PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  })
  const { data: counts } = useVoucherStatusCounts()

  const handleCreate = () => {
    createVoucher.mutate(
      {
        code: form.code,
        name: form.name,
        type: form.type,
        discountValue: Number(form.discountValue),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        startsAt: form.startsAt,
        expiresAt: form.expiresAt,
      },
      {
        onSuccess: () => {
          setShowForm(false)
          setForm({
            code: '',
            name: '',
            type: CouponType.PERCENTAGE as CouponType,
            discountValue: '',
            minOrderAmount: '',
            usageLimit: '',
            startsAt: '',
            expiresAt: '',
          })
        },
      },
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vouchers</h1>
          <p className="text-muted-foreground text-sm">Platform promotion management</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm"
        >
          Create Voucher
        </button>
      </div>

      {showForm && (
        <div className="bg-card space-y-3 rounded-xl border p-6 shadow-sm">
          <h2 className="font-semibold">New Voucher</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input
              placeholder="Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="h-9 rounded-md border px-3 text-sm"
            />
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as CouponType })}
              className="h-9 rounded-md border px-3 text-sm"
            >
              <option value={CouponType.PERCENTAGE}>Percentage</option>
              <option value={CouponType.FIXED_AMOUNT}>Fixed Amount</option>
              <option value={CouponType.FREE_SHIPPING}>Free Shipping</option>
            </select>
            <input
              placeholder="Discount Value"
              type="number"
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm"
            />
            <input
              placeholder="Min Order Amount"
              type="number"
              value={form.minOrderAmount}
              onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm"
            />
            <input
              placeholder="Usage Limit"
              type="number"
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm"
            />
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm"
            />
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={createVoucher.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-1.5 text-sm disabled:opacity-50"
            >
              {createVoucher.isPending ? 'Creating...' : 'Create'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="hover:bg-muted rounded border px-4 py-1.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
        toolbar={
          <TableToolbar
            search={search}
            onSearchChange={(v) => {
              setSearch(v)
              debounce(v)
            }}
            placeholder="Search vouchers..."
          />
        }
      />
    </div>
  )
}
