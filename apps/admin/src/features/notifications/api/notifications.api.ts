import { apiFetch } from '@/lib/api'
import type { PaginatedResponse } from '@ecom/shared/pagination/core'

export interface NotificationListItem {
  id: string
  title: string
  message: string
  channel: string
  status: string
  targetAll: boolean
  sentAt: string | null
  createdAt: string
}

export interface NotificationTemplate {
  id: string
  name: string
  subject: string
  body: string
  channel: string
}

export async function getNotifications(params: { page?: number; limit?: number; status?: string }) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.status) query.set('status', params.status)
  return apiFetch<{ success: boolean; data: PaginatedResponse<NotificationListItem> }>(
    `/admin/notifications?${query.toString()}`,
  )
}

export async function createNotification(data: Record<string, unknown>) {
  return apiFetch<{ success: boolean; data: NotificationListItem }>('/admin/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function sendNotification(id: string) {
  return apiFetch<{ success: boolean }>(`/admin/notifications/${id}/send`, { method: 'POST' })
}

export async function getTemplates() {
  return apiFetch<{ success: boolean; data: NotificationTemplate[] }>(
    '/admin/notifications/templates',
  )
}

export async function createTemplate(data: Record<string, unknown>) {
  return apiFetch<{ success: boolean; data: NotificationTemplate }>(
    '/admin/notifications/templates',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}
