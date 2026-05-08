import type {
  OffsetPaginationMeta,
  PaginatedResponse,
  LegacyPaginatedResponse,
  CursorPaginationMeta,
  CursorPaginatedResponse,
} from '../types';

/**
 * Build standardized offset pagination response.
 * Uses { items, meta: { pageSize } } format.
 */
export function buildOffsetResponse<T>(
  items: T[],
  page: number,
  pageSize: number,
  total: number
): PaginatedResponse<T> {
  return {
    items,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

/**
 * Build legacy pagination response for backward compatibility.
 * Uses { data, meta: { limit } } format.
 * @deprecated Use buildOffsetResponse instead. Remove after Phase 4 migration.
 */
export function buildLegacyResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total: number
): LegacyPaginatedResponse<T> {
  return {
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Build cursor pagination response.
 */
export function buildCursorResponse<T>(
  items: T[],
  nextCursor: string | null,
  hasMore: boolean,
  limit: number
): CursorPaginatedResponse<T> {
  return {
    items,
    meta: {
      nextCursor,
      hasMore,
      limit,
    },
  };
}
