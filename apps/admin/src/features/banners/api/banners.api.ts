import { apiFetch } from '@/lib/api'
import type { PaginatedResponse } from '@ecom/shared/pagination/core'

export interface BannerListItem {
  id: string
  title: string
  position: string
  status: string
  imageUrl: string
  mobileImageUrl: string | null
  linkUrl: string | null
  sortOrder: number
  startsAt: string | null
  endsAt: string | null
  createdAt: string
}

export async function getBanners(params: {
  page?: number
  limit?: number
  position?: string
  status?: string
}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.position) query.set('position', params.position)
  if (params.status) query.set('status', params.status)
  return apiFetch<{ success: boolean; data: PaginatedResponse<BannerListItem> }>(
    `/admin/banners?${query.toString()}`,
  )
}

export async function getBanner(id: string) {
  return apiFetch<{ success: boolean; data: BannerListItem }>(`/admin/banners/${id}`)
}

export async function createBanner(data: Record<string, unknown>) {
  return apiFetch<{ success: boolean; data: BannerListItem }>('/admin/banners', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateBanner(id: string, data: Record<string, unknown>) {
  return apiFetch<{ success: boolean; data: BannerListItem }>(`/admin/banners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteBanner(id: string) {
  return apiFetch<{ success: boolean }>(`/admin/banners/${id}`, { method: 'DELETE' })
}
