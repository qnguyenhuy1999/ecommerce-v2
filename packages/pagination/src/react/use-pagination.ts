import { useState, useCallback } from 'react';

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  onPageChange?: (page: number) => void;
}

export interface UsePaginationReturn {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

/**
 * Hook for managing pagination state.
 * Provides page/pageSize state and navigation helpers.
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const { initialPage = 1, initialPageSize = 20, onPageChange } = options;
  const [page, setPageState] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const setPage = useCallback(
    (newPage: number) => {
      setPageState(newPage);
      onPageChange?.(newPage);
    },
    [onPageChange]
  );

  const nextPage = useCallback(() => setPage(page + 1), [page, setPage]);
  const prevPage = useCallback(
    () => setPage(Math.max(1, page - 1)),
    [page, setPage]
  );
  const reset = useCallback(() => setPage(1), [setPage]);

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    reset,
  };
}
