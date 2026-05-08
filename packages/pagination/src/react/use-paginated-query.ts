import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { usePagination, type UsePaginationOptions } from './use-pagination';
import type { PaginatedResponse } from '../types';

export interface UsePaginatedQueryOptions<T> extends UsePaginationOptions {
  queryKey: unknown[];
  queryFn: (page: number, pageSize: number) => Promise<PaginatedResponse<T>>;
  queryOptions?: Omit<UseQueryOptions<PaginatedResponse<T>>, 'queryKey' | 'queryFn'>;
}

export interface UsePaginatedQueryReturn<T> {
  data: PaginatedResponse<T> | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
  totalPages: number;
  total: number;
}

/**
 * Hook for paginated queries with React Query integration.
 * Combines pagination state with data fetching.
 */
export function usePaginatedQuery<T>(
  options: UsePaginatedQueryOptions<T>
): UsePaginatedQueryReturn<T> {
  const { queryKey, queryFn, queryOptions, ...paginationOptions } = options;
  const pagination = usePagination(paginationOptions);

  const query = useQuery({
    queryKey: [...queryKey, pagination.page, pagination.pageSize],
    queryFn: () => queryFn(pagination.page, pagination.pageSize),
    ...queryOptions,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    ...pagination,
    totalPages: query.data?.meta.totalPages ?? 1,
    total: query.data?.meta.total ?? 0,
  };
}
