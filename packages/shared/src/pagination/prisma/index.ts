export * from './offset-paginate'
export * from './cursor-paginate'
export * from './stable-sort'

/**
 * Build a paginated response in the canonical shape expected by the ResponseInterceptor.
 * Returns `{ items, meta }` — the interceptor wraps this into the final envelope:
 * `{ success: true, data: { items }, meta, timestamp }`
 */
export function buildOffsetResponse<T>(data: T[], page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit)
  return {
    items: data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}
