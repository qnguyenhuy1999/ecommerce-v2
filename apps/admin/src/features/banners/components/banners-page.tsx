'use client'

import { useState } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { DataTable, StatusBadge, StatusTabs } from '@ecom/core-ui'
import { useBanners, useCreateBanner } from '../hooks/use-banners'
import type { BannerListItem } from '../api/banners.api'

const col = createColumnHelper<BannerListItem>()

const columns = [
  col.accessor('title', {
    header: 'Title',
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  col.accessor('position', {
    header: 'Position',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  col.accessor('sortOrder', { header: 'Order' }),
  col.accessor('startsAt', {
    header: 'Starts',
    cell: (info) => (info.getValue() ? new Date(info.getValue()!).toLocaleDateString() : '—'),
  }),
  col.accessor('endsAt', {
    header: 'Ends',
    cell: (info) => (info.getValue() ? new Date(info.getValue()!).toLocaleDateString() : '—'),
  }),
]

const STATUS_TABS = ['ALL', 'DRAFT', 'SCHEDULED', 'ACTIVE', 'EXPIRED', 'ARCHIVED']

export function BannersPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const createBanner = useCreateBanner()

  const [form, setForm] = useState({
    title: '',
    position: 'HERO',
    imageUrl: '',
    linkUrl: '',
    startsAt: '',
    endsAt: '',
  })

  const { data, isLoading } = useBanners({
    page,
    limit: PAGINATION_DEFAULTS.PAGE_SIZE,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  })

  const handleCreate = () => {
    createBanner.mutate(
      {
        title: form.title,
        position: form.position,
        imageUrl: form.imageUrl,
        linkUrl: form.linkUrl || undefined,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
      },
      {
        onSuccess: () => {
          setShowForm(false)
          setForm({
            title: '',
            position: 'HERO',
            imageUrl: '',
            linkUrl: '',
            startsAt: '',
            endsAt: '',
          })
        },
      },
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banners</h1>
          <p className="text-sm text-muted-foreground">CMS & banner management</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Create Banner
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-3">
          <h2 className="font-semibold">New Banner</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm"
            />
            <select
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm"
            >
              <option value="HERO">Hero</option>
              <option value="HOMEPAGE_TOP">Homepage Top</option>
              <option value="HOMEPAGE_MIDDLE">Homepage Middle</option>
              <option value="CAMPAIGN">Campaign</option>
              <option value="ANNOUNCEMENT">Announcement</option>
            </select>
            <input
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm"
            />
            <input
              placeholder="Link URL"
              value={form.linkUrl}
              onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
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
              value={form.endsAt}
              onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={createBanner.isPending}
              className="rounded bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {createBanner.isPending ? 'Creating...' : 'Create'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded border px-4 py-1.5 text-sm hover:bg-muted"
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
