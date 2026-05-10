export const PAGINATION_DEFAULTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  PAGE_SIZE: 20,
  MAX_LIMIT: 100,
  DEFAULT_SORT_ORDER: 'desc' as const,
} as const

export type DefaultSortOrder = typeof PAGINATION_DEFAULTS.DEFAULT_SORT_ORDER
