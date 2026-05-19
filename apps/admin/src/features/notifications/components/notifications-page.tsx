'use client'

import { useState } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { NotificationStatus } from '@ecom/contracts'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { DataTable, StatusBadge, StatusTabs } from '@ecom/core-ui'
import {
  useNotifications,
  useCreateNotification,
  useSendNotification,
} from '../hooks/use-notifications'
import type { NotificationListItem } from '../api/notifications.api'

const col = createColumnHelper<NotificationListItem>()

const columns = [
  col.accessor('title', {
    header: 'Title',
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  col.accessor('channel', {
    header: 'Channel',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  col.accessor('targetAll', {
    header: 'Target',
    cell: (info) => (info.getValue() ? 'All Users' : 'Selected'),
  }),
  col.accessor('sentAt', {
    header: 'Sent',
    cell: (info) => {
      const value = info.getValue()

      return value ? new Date(value).toLocaleDateString() : '—'
    },
  }),
  col.display({
    id: 'actions',
    header: 'Actions',
    cell: function ActionCell({ row }) {
      const send = useSendNotification()
      if (row.original.status !== NotificationStatus.DRAFT) return null
      return (
        <button
          onClick={() => send.mutate(row.original.id)}
          disabled={send.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-2 py-1 text-xs disabled:opacity-50"
        >
          Send
        </button>
      )
    },
  }),
]

const STATUS_TABS: string[] = ['ALL', ...(Object.values(NotificationStatus) as string[])]

export function NotificationsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const createNotification = useCreateNotification()

  const [form, setForm] = useState({ title: '', message: '', channel: 'IN_APP', targetAll: true })

  const { data, isLoading } = useNotifications({
    page,
    limit: PAGINATION_DEFAULTS.PAGE_SIZE,
    ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
  })

  const handleCreate = () => {
    createNotification.mutate(form, {
      onSuccess: () => {
        setShowForm(false)
        setForm({ title: '', message: '', channel: 'IN_APP', targetAll: true })
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground text-sm">Broadcast & notification management</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm"
        >
          New Notification
        </button>
      </div>

      {showForm && (
        <div className="bg-card space-y-3 rounded-xl border p-6 shadow-sm">
          <h2 className="font-semibold">New Notification</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm"
            />
            <select
              value={form.channel}
              onChange={(e) => setForm({ ...form, channel: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm"
            >
              <option value="IN_APP">In-App</option>
              <option value="EMAIL">Email</option>
              <option value="PUSH">Push</option>
            </select>
          </div>
          <textarea
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-md border px-3 py-2 text-sm"
            rows={3}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.targetAll}
              onChange={(e) => setForm({ ...form, targetAll: e.target.checked })}
            />
            Send to all users
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={createNotification.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-1.5 text-sm disabled:opacity-50"
            >
              {createNotification.isPending ? 'Creating...' : 'Create Draft'}
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
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        {...(data?.meta !== undefined ? { meta: data.meta } : {})}
        loading={isLoading}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  )
}
