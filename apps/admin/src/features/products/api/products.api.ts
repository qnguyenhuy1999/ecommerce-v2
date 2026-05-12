import { apiFetch } from '@/lib/api'
import type { AdminOperations } from '@ecom/contracts/generated'
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

type ProductListQuery = NonNullable<
  AdminOperations['ProductsController_findAll']['parameters']['query']
>
export type { ProductListQuery }
type ProductListResponse =
  AdminOperations['ProductsController_findAll']['responses']['200']['content']['application/json'] & {
    data: PaginatedResponse<ProductListItem>
  }
type ProductDetailResponse =
  AdminOperations['ProductsController_findById']['responses']['200']['content']['application/json'] & {
    data: ProductDetail
  }
type ProductStatusCountsResponse =
  AdminOperations['ProductsController_statusCounts']['responses']['200']['content']['application/json'] & {
    data: Record<string, number>
  }
type ProductApproveBody =
  AdminOperations['ProductsController_approve']['requestBody']['content']['application/json']
type ProductRejectBody =
  AdminOperations['ProductsController_reject']['requestBody']['content']['application/json']
type ProductApproveResponse =
  AdminOperations['ProductsController_approve']['responses']['200']['content']['application/json']
type ProductRejectResponse =
  AdminOperations['ProductsController_reject']['responses']['200']['content']['application/json']
type ProductBulkActionBody =
  AdminOperations['ProductsController_bulkApprove']['requestBody']['content']['application/json']
type ProductBulkApproveResponse =
  AdminOperations['ProductsController_bulkApprove']['responses']['200']['content']['application/json']
type ProductBulkRejectResponse =
  AdminOperations['ProductsController_bulkReject']['responses']['200']['content']['application/json']
type ProductHideResponse =
  AdminOperations['ProductsController_hide']['responses']['200']['content']['application/json']
type ProductUnhideResponse =
  AdminOperations['ProductsController_unhide']['responses']['200']['content']['application/json']

export async function getProducts(params: ProductListQuery = {}) {
  const query: ProductListQuery = {
    ...(params.page !== undefined && { page: params.page }),
    ...(params.limit !== undefined && { limit: params.limit }),
    ...(params.search !== undefined && { search: params.search }),
    ...(params.status !== undefined && { status: params.status }),
    ...(params.shopId !== undefined && { shopId: params.shopId }),
    ...(params.categoryId !== undefined && { categoryId: params.categoryId }),
  }

  return apiFetch<ProductListResponse>('/admin/products', { params: query })
}

export async function getProduct(id: string) {
  return apiFetch<ProductDetailResponse>(`/admin/products/${id}`)
}

export async function getProductStatusCounts() {
  return apiFetch<ProductStatusCountsResponse>('/admin/products/status-counts')
}

export async function approveProduct(id: string, note?: string) {
  const body: ProductApproveBody = { note: note ?? '' }

  return apiFetch<ProductApproveResponse>(`/admin/products/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function rejectProduct(id: string, note?: string) {
  const body: ProductRejectBody = { note: note ?? '' }

  return apiFetch<ProductRejectResponse>(`/admin/products/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function hideProduct(id: string) {
  return apiFetch<ProductHideResponse>(`/admin/products/${id}/hide`, { method: 'POST' })
}

export async function unhideProduct(id: string) {
  return apiFetch<ProductUnhideResponse>(`/admin/products/${id}/unhide`, { method: 'POST' })
}

export async function bulkApproveProducts(ids: string[], note = '') {
  const body: ProductBulkActionBody = { ids, note }

  return apiFetch<ProductBulkApproveResponse>('/admin/products/bulk/approve', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function bulkRejectProducts(ids: string[], note = '') {
  const body: ProductBulkActionBody = { ids, note }

  return apiFetch<ProductBulkRejectResponse>('/admin/products/bulk/reject', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
