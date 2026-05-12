'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications,
  createNotification,
  sendNotification,
  getTemplates,
  createTemplate,
} from '../api/notifications.api'

export function useNotifications(params: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const res = await getNotifications(params)
      return res.data
    },
  })
}

export function useTemplates() {
  return useQuery({
    queryKey: ['notification-templates'],
    queryFn: async () => {
      const res = await getTemplates()
      return res.data
    },
  })
}

function useInvalidateNotifications() {
  const qc = useQueryClient()
  return () => {
    void qc.invalidateQueries({ queryKey: ['notifications'] })
  }
}

export function useCreateNotification() {
  const invalidate = useInvalidateNotifications()
  return useMutation({ mutationFn: createNotification, onSuccess: invalidate })
}

export function useSendNotification() {
  const invalidate = useInvalidateNotifications()
  return useMutation({ mutationFn: sendNotification, onSuccess: invalidate })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTemplate,
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['notification-templates'] }),
  })
}
