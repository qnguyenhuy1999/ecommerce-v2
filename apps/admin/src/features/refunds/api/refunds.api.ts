import { apiFetch } from '@/lib/api'
import type { PaginatedResponse } from '@ecom/shared/pagination/core'

export interface RefundListItem {
  id: string
  status: string
  reason: string
  refundMethod: string | null
  refundAmount: string | null
  createdAt: string
  resolvedAt: string | null
  items: { id: string; quantity: number }[]
  evidence: { id: string; type: string; url: string }[]
  timeline: {
    id: string
    fromStatus: string
    toStatus: string
    note: string | null
    createdAt: string
  }[]
}

export async function getRefunds(params: { page?: number; limit?: number; status?: string }) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.status) query.set('status', params.status)
  return apiFetch<{ success: boolean; data: PaginatedResponse<RefundListItem> }>(
    `/admin/refunds?${query.toString()}`,
  )
}

export async function getRefund(id: string) {
  return apiFetch<{ success: boolean; data: RefundListItem }>(`/admin/refunds/${id}`)
}

export async function getRefundStatusCounts() {
  return apiFetch<{ success: boolean; data: Record<string, number> }>(
    '/admin/refunds/status-counts',
  )
}

export async function approveRefund(id: string, note?: string) {
  return apiFetch<{ success: boolean }>(`/admin/refunds/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  })
}

export async function rejectRefund(id: string, note?: string) {
  return apiFetch<{ success: boolean }>(`/admin/refunds/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  })
}
