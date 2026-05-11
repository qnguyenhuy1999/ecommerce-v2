import type { PaginationMeta, PaginatedResponse, OffsetParams } from './types'
import { PAGINATION_DEFAULTS } from './constants'

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit)
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  params: OffsetParams,
): PaginatedResponse<T> {
  const page = params.page ?? PAGINATION_DEFAULTS.DEFAULT_PAGE
  const limit = Math.min(
    params.limit ?? PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    PAGINATION_DEFAULTS.MAX_LIMIT,
  )
  const meta = buildPaginationMeta(total, page, limit)
  return { data, meta }
}

export function normalizeOffsetParams(params: OffsetParams): Required<OffsetParams> {
  const page = Math.max(1, params.page ?? PAGINATION_DEFAULTS.DEFAULT_PAGE)
  const limit = Math.min(
    params.limit ?? PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    PAGINATION_DEFAULTS.MAX_LIMIT,
  )
  const sortOrder = params.sortOrder ?? PAGINATION_DEFAULTS.DEFAULT_SORT_ORDER
  return {
    page,
    limit,
    sortBy: params.sortBy ?? 'createdAt',
    sortOrder,
  }
}

export function getSkip(page: number, limit: number): number {
  return (page - 1) * limit
}
