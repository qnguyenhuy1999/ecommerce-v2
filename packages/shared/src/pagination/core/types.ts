export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface OffsetParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CursorParams {
  cursor?: string
  limit?: number
}

export interface CursorResponse<T, TCursor = string | number> {
  data: T[]
  nextCursor: TCursor | null
  hasNextPage: boolean
}
