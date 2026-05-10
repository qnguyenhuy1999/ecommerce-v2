import { useState, useCallback, useMemo } from 'react'
import { PAGINATION_DEFAULTS } from '../core'

export interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
  maxLimit?: number
  total?: number
}

export interface PaginationState {
  page: number
  limit: number
}

export function usePagination(options: UsePaginationOptions = {}) {
  const {
    initialPage = PAGINATION_DEFAULTS.DEFAULT_PAGE,
    initialLimit = PAGINATION_DEFAULTS.DEFAULT_LIMIT,
    maxLimit = PAGINATION_DEFAULTS.MAX_LIMIT,
    total = 0,
  } = options

  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit])

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage))
  }, [])

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1)
  }, [])

  const previousPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1))
  }, [])

  const setItemsPerPage = useCallback(
    (newLimit: number) => {
      const clampedLimit = Math.min(newLimit, maxLimit)
      setLimit(clampedLimit)
      setPage(1)
    },
    [maxLimit],
  )

  const canGoNext = page < totalPages
  const canGoPrevious = page > 1

  return {
    page,
    limit,
    totalPages,
    total,
    goToPage,
    nextPage,
    previousPage,
    setItemsPerPage,
    canGoNext,
    canGoPrevious,
  }
}
