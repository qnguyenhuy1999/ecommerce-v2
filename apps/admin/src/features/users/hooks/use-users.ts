'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUsers,
  getUser,
  getUserStatusCounts,
  suspendUser,
  banUser,
  activateUser,
  type UserListQuery,
} from '../api/users.api'

export function useUsers(params: UserListQuery) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const res = await getUsers(params)
      return res.data
    },
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await getUser(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useUserStatusCounts() {
  return useQuery({
    queryKey: ['user-status-counts'],
    queryFn: async () => {
      const res = await getUserStatusCounts()
      return res.data
    },
  })
}

function useInvalidateUsers() {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: ['users'] })
    qc.invalidateQueries({ queryKey: ['user'] })
    qc.invalidateQueries({ queryKey: ['user-status-counts'] })
  }
}

export function useSuspendUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => suspendUser(id, reason),
    onSuccess: invalidate,
  })
}

export function useBanUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => banUser(id, reason),
    onSuccess: invalidate,
  })
}

export function useActivateUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({ mutationFn: activateUser, onSuccess: invalidate })
}
