'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSellers,
  getSellerById,
  approveSeller,
  rejectSeller,
  suspendSeller,
  getSellerStatusCounts,
  type SellersListQuery,
} from '../api/sellers.api'

export function useSellers(params: SellersListQuery) {
  return useQuery({
    queryKey: ['sellers', params],
    queryFn: async () => {
      const res = await getSellers(params)
      return res.data
    },
  })
}

export function useSellerDetail(id: string) {
  return useQuery({
    queryKey: ['seller', id],
    queryFn: async () => {
      const res = await getSellerById(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useSellerStatusCounts() {
  return useQuery({
    queryKey: ['seller-status-counts'],
    queryFn: async () => {
      const res = await getSellerStatusCounts()
      return res.data
    },
  })
}

export function useApproveSeller() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: approveSeller,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['sellers'] })
      void queryClient.invalidateQueries({ queryKey: ['seller'] })
      void queryClient.invalidateQueries({ queryKey: ['seller-status-counts'] })
    },
  })
}

export function useRejectSeller() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => rejectSeller(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['sellers'] })
      void queryClient.invalidateQueries({ queryKey: ['seller'] })
      void queryClient.invalidateQueries({ queryKey: ['seller-status-counts'] })
    },
  })
}

export function useSuspendSeller() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => suspendSeller(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['sellers'] })
      void queryClient.invalidateQueries({ queryKey: ['seller'] })
      void queryClient.invalidateQueries({ queryKey: ['seller-status-counts'] })
    },
  })
}
