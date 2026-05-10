'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBanners, getBanner, createBanner, updateBanner, deleteBanner } from '../api/banners.api'

export function useBanners(params: {
  page?: number
  limit?: number
  position?: string
  status?: string
}) {
  return useQuery({
    queryKey: ['banners', params],
    queryFn: async () => {
      const res = await getBanners(params)
      return res.data
    },
  })
}

export function useBanner(id: string) {
  return useQuery({
    queryKey: ['banner', id],
    queryFn: async () => {
      const res = await getBanner(id)
      return res.data
    },
    enabled: !!id,
  })
}

function useInvalidateBanners() {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: ['banners'] })
    qc.invalidateQueries({ queryKey: ['banner'] })
  }
}

export function useCreateBanner() {
  const invalidate = useInvalidateBanners()
  return useMutation({ mutationFn: createBanner, onSuccess: invalidate })
}

export function useUpdateBanner() {
  const invalidate = useInvalidateBanners()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateBanner(id, data),
    onSuccess: invalidate,
  })
}

export function useDeleteBanner() {
  const invalidate = useInvalidateBanners()
  return useMutation({ mutationFn: deleteBanner, onSuccess: invalidate })
}
