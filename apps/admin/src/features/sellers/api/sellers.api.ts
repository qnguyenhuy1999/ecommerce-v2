import { apiFetch } from '@/lib/api'
import type { AdminOperations } from '@ecom/contracts/generated'
import type { PaginatedResponse } from '@ecom/shared/pagination/core'

export interface Seller {
  id: string
  shopName: string
  shopDescription: string | null
  phone: string | null
  address: string | null
  status: string
  approvedAt: string | null
  rejectedAt: string | null
  suspendedAt: string | null
  rejectReason: string | null
  suspendReason: string | null
  createdAt: string
  updatedAt: string
  user?: { id: string; email: string; status: string }
}

export interface SellerDetail extends Seller {
  user?: { id: string; email: string; status: string; createdAt: string }
  verifications: {
    id: string
    documentType: string
    documentUrl: string
    status: string
    adminNote: string | null
    reviewedAt: string | null
    createdAt: string
  }[]
}

type SellersListQuery = NonNullable<
  AdminOperations['SellersController_findAll']['parameters']['query']
>
export type { SellersListQuery }
type SellersListResponse =
  AdminOperations['SellersController_findAll']['responses']['200']['content']['application/json'] & {
    data: PaginatedResponse<Seller>
  }
type SellerDetailResponse =
  AdminOperations['SellersController_findById']['responses']['200']['content']['application/json'] & {
    data: SellerDetail
  }
type SellerStatusCountsResponse =
  AdminOperations['SellersController_statusCounts']['responses']['200']['content']['application/json'] & {
    data: Record<string, number>
  }
type SellerActionBody =
  AdminOperations['SellersController_reject']['requestBody']['content']['application/json']
type SellerActionResponse =
  AdminOperations['SellersController_reject']['responses']['200']['content']['application/json']

export async function getSellers(params: SellersListQuery = {}) {
  const query: SellersListQuery = {
    ...(params.page !== undefined && { page: params.page }),
    ...(params.limit !== undefined && { limit: params.limit }),
    ...(params.search !== undefined && { search: params.search }),
    ...(params.status !== undefined && { status: params.status }),
  }

  return apiFetch<SellersListResponse>('/admin/sellers', { params: query })
}

export async function getSellerById(id: string) {
  return apiFetch<SellerDetailResponse>(`/admin/sellers/${id}`)
}

export async function approveSeller(id: string) {
  return apiFetch<SellerActionResponse>(`/admin/sellers/${id}/approve`, {
    method: 'POST',
  })
}

export async function rejectSeller(id: string, reason?: string) {
  const body: SellerActionBody = {
    ...(reason !== undefined && { reason }),
  }

  return apiFetch<SellerActionResponse>(`/admin/sellers/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function suspendSeller(id: string, reason?: string) {
  const body: SellerActionBody = {
    ...(reason !== undefined && { reason }),
  }

  return apiFetch<SellerActionResponse>(`/admin/sellers/${id}/suspend`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getSellerStatusCounts() {
  return apiFetch<SellerStatusCountsResponse>('/admin/sellers/status-counts')
}
