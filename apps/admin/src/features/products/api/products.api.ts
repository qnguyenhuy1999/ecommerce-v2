import { apiFetch } from '@/lib/api'
import type { PaginatedResponse } from '@ecom/shared/pagination/core'

export interface ProductListItem {
  id: string
  name: string
  slug: string
  status: string
  basePrice: string | null
  baseStock: number
  hasVariants: boolean
  createdAt: string
  shop: { id: string; name: string }
  category: { id: string; name: string } | null
  images: { url: string }[]
  _count: { variants: number }
}

export interface ProductDetail extends ProductListItem {
  description: string | null
  baseSku: string | null
  weight: string | null
  variants: {
    id: string
    sku: string | null
    price: string
    stock: number
    isActive: boolean
    optionValues: { option: { value: string; group: { name: string } } }[]
  }[]
  variantOptionGroups: {
    id: string
    name: string
    options: { id: string; value: string }[]
  }[]
}

export async function getProducts(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
  shopId?: string
  categoryId?: string
}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.search) query.set('search', params.search)
  if (params.status) query.set('status', params.status)
  if (params.shopId) query.set('shopId', params.shopId)
  if (params.categoryId) query.set('categoryId', params.categoryId)
  return apiFetch<{ success: boolean; data: PaginatedResponse<ProductListItem> }>(
    `/admin/products?${query.toString()}`,
  )
}

export async function getProduct(id: string) {
  return apiFetch<{ success: boolean; data: ProductDetail }>(`/admin/products/${id}`)
}

export async function getProductStatusCounts() {
  return apiFetch<{ success: boolean; data: Record<string, number> }>(
    '/admin/products/status-counts',
  )
}

export async function approveProduct(id: string, note?: string) {
  return apiFetch<{ success: boolean }>(`/admin/products/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  })
}

export async function rejectProduct(id: string, note?: string) {
  return apiFetch<{ success: boolean }>(`/admin/products/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  })
}

export async function hideProduct(id: string) {
  return apiFetch<{ success: boolean }>(`/admin/products/${id}/hide`, { method: 'POST' })
}

export async function unhideProduct(id: string) {
  return apiFetch<{ success: boolean }>(`/admin/products/${id}/unhide`, { method: 'POST' })
}

export async function bulkApproveProducts(ids: string[]) {
  return apiFetch<{ success: boolean }>('/admin/products/bulk/approve', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  })
}

export async function bulkRejectProducts(ids: string[]) {
  return apiFetch<{ success: boolean }>('/admin/products/bulk/reject', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  })
}
