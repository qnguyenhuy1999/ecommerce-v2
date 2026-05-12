import { apiFetch } from '@/lib/api'
import type { TypedApiResponse } from '@/lib/api-types'
import type { PaginatedResponse } from '@ecom/shared/pagination/core'

export interface UserListItem {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  emailVerified: boolean
  status: string
  createdAt: string
}

export interface UserDetail extends UserListItem {
  sessions: {
    id: string
    userAgent: string | null
    ipAddress: string | null
    expiresAt: string
    createdAt: string
  }[]
}

export async function getUsers(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.search) query.set('search', params.search)
  if (params.status) query.set('status', params.status)
  return apiFetch<TypedApiResponse<PaginatedResponse<UserListItem>>>(
    `/admin/users?${query.toString()}`,
  )
}

export async function getUser(id: string) {
  return apiFetch<TypedApiResponse<UserDetail>>(`/admin/users/${id}`)
}

export async function getUserStatusCounts() {
  return apiFetch<TypedApiResponse<Record<string, number>>>('/admin/users/status-counts')
}

export async function suspendUser(id: string, reason?: string) {
  return apiFetch<TypedApiResponse<never>>(`/admin/users/${id}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

export async function banUser(id: string, reason?: string) {
  return apiFetch<TypedApiResponse<never>>(`/admin/users/${id}/ban`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
}

export async function activateUser(id: string) {
  return apiFetch<TypedApiResponse<never>>(`/admin/users/${id}/activate`, { method: 'POST' })
}
