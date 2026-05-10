'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrders,
  getOrder,
  getOrderStatusCounts,
  forceCancelOrder,
  forceCompleteOrder,
} from '../api/orders.api'

export function useOrders(params: {
  page?: number
  limit?: number
  search?: string
  status?: string
  buyerId?: string
}) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const res = await getOrders(params)
      return res.data
    },
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await getOrder(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useOrderStatusCounts() {
  return useQuery({
    queryKey: ['order-status-counts'],
    queryFn: async () => {
      const res = await getOrderStatusCounts()
      return res.data
    },
  })
}

function useInvalidateOrders() {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: ['orders'] })
    qc.invalidateQueries({ queryKey: ['order'] })
    qc.invalidateQueries({ queryKey: ['order-status-counts'] })
  }
}

export function useForceCancelOrder() {
  const invalidate = useInvalidateOrders()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => forceCancelOrder(id, reason),
    onSuccess: invalidate,
  })
}

export function useForceCompleteOrder() {
  const invalidate = useInvalidateOrders()
  return useMutation({ mutationFn: forceCompleteOrder, onSuccess: invalidate })
}
