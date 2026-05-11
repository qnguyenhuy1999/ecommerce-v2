import { useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { PaginationState } from './use-pagination'
import { PaginatedResponse } from '../core'

export interface UsePaginatedQueryOptions<TData, TError = Error> extends Omit<
  UseQueryOptions<PaginatedResponse<TData>, TError>,
  'queryKey' | 'queryFn'
> {
  queryKey: unknown[]
  queryFn: (params: { page: number; limit: number }) => Promise<PaginatedResponse<TData>>
  pagination: PaginationState
  keepPreviousData?: boolean
}

export function usePaginatedQuery<TData, TError = Error>({
  queryKey,
  queryFn,
  pagination,
  keepPreviousData = true,
  ...queryOptions
}: UsePaginatedQueryOptions<TData, TError>): UseQueryResult<PaginatedResponse<TData>, TError> {
  const { page, limit } = pagination

  const combinedQueryKey = [...queryKey, { page, limit }]

  return useQuery({
    queryKey: combinedQueryKey,
    queryFn: () => queryFn({ page, limit }),
    ...(keepPreviousData ? { placeholderData: (previousData: PaginatedResponse<TData> | undefined) => previousData } : {}),
    ...queryOptions,
  })
}

export function usePrefetchPaginatedQuery<TData>({
  queryKey,
  queryFn,
  pagination,
}: {
  queryKey: unknown[]
  queryFn: (params: { page: number; limit: number }) => Promise<PaginatedResponse<TData>>
  pagination: PaginationState & { totalPages: number }
}): void {
  const queryClient = useQueryClient()
  const { page, limit, totalPages } = pagination

  // Prefetch next page if exists
  if (page < totalPages) {
    const nextPage = page + 1
    queryClient.prefetchQuery({
      queryKey: [...queryKey, { page: nextPage, limit }],
      queryFn: () => queryFn({ page: nextPage, limit }),
    })
  }

  // Prefetch previous page if exists
  if (page > 1) {
    const prevPage = page - 1
    queryClient.prefetchQuery({
      queryKey: [...queryKey, { page: prevPage, limit }],
      queryFn: () => queryFn({ page: prevPage, limit }),
    })
  }
}
