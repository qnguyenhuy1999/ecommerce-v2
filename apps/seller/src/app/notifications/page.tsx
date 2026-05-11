'use client'

import { useState, useEffect } from 'react'
import { Bell, Check } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { api } from '../../lib/api'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

interface NotificationsResponse {
  data: Notification[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true)
      try {
        const res = await api<{ data: NotificationsResponse }>('/notifications', {
          params: { page, limit: 20, unreadOnly: unreadOnly || undefined },
        })
        setNotifications(res.data.data)
        setTotalPages(res.data.meta.totalPages)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [page, unreadOnly])

  const markAsRead = async (id: string) => {
    try {
      await api(`/notifications/${id}/read`, { method: 'POST' })
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    } catch {
      /* empty */
    }
  }

  const markAllAsRead = async () => {
    try {
      await api('/notifications/read-all', { method: 'POST' })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch {
      /* empty */
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Notifications"
        description="Stay updated with your store activity"
        actions={
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </button>
        }
      />

      <div className="mb-4">
        <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => {
              setUnreadOnly(e.target.checked)
              setPage(1)
            }}
            className="rounded border-gray-300"
          />
          Unread only
        </label>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}
      {!loading && notifications.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No notifications</p>
        </div>
      )}
      {!loading && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const cardClass = notification.isRead
              ? 'border-gray-200'
              : 'border-blue-200 bg-blue-50'
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border p-4 ${cardClass}`}
              >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded">
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
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
