import { apiFetch } from '@/lib/api'
import type { AdminOperations } from '@ecom/contracts/generated'
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

type UserListQuery = NonNullable<AdminOperations['UsersController_findAll']['parameters']['query']>
export type { UserListQuery }
type UserListResponse =
  AdminOperations['UsersController_findAll']['responses']['200']['content']['application/json'] & {
    data: PaginatedResponse<UserListItem>
  }
type UserDetailResponse =
  AdminOperations['UsersController_findById']['responses']['200']['content']['application/json'] & {
    data: UserDetail
  }
type UserStatusCountsResponse =
  AdminOperations['UsersController_statusCounts']['responses']['200']['content']['application/json'] & {
    data: Record<string, number>
  }
type UserActionBody =
  AdminOperations['UsersController_suspend']['requestBody']['content']['application/json']
type UserActionResponse =
  AdminOperations['UsersController_suspend']['responses']['200']['content']['application/json']

export async function getUsers(params: UserListQuery = {}) {
  const query: UserListQuery = {
    ...(params.page !== undefined && { page: params.page }),
    ...(params.limit !== undefined && { limit: params.limit }),
    ...(params.search !== undefined && { search: params.search }),
    ...(params.status !== undefined && { status: params.status }),
  }

  return apiFetch<UserListResponse>('/admin/users', { params: query })
}

export async function getUser(id: string) {
  return apiFetch<UserDetailResponse>(`/admin/users/${id}`)
}

export async function getUserStatusCounts() {
  return apiFetch<UserStatusCountsResponse>('/admin/users/status-counts')
}

export async function suspendUser(id: string, reason?: string) {
  const body: UserActionBody = {
    ...(reason !== undefined && { reason }),
  }

  return apiFetch<UserActionResponse>(`/admin/users/${id}/suspend`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function banUser(id: string, reason?: string) {
  const body: UserActionBody = {
    ...(reason !== undefined && { reason }),
  }

  return apiFetch<UserActionResponse>(`/admin/users/${id}/ban`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function activateUser(id: string) {
  return apiFetch<UserActionResponse>(`/admin/users/${id}/activate`, { method: 'POST' })
}
