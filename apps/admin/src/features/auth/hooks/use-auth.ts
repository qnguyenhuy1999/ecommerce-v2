'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { getAdminProfile, loginAdmin, logoutAdmin, type AdminProfile } from '../api/auth.api'

export function useAdminProfile() {
  return useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const res = await getAdminProfile()
      return res.data
    },
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginAdmin(email, password),
    onSuccess: (res) => {
      queryClient.setQueryData(['admin-profile'], res.data)
      router.push('/')
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      queryClient.clear()
      router.push('/login')
    },
  })
}

export function useHasPermission(profile: AdminProfile | undefined, permission: string): boolean {
  if (!profile) return false
  return profile.permissions.includes(permission)
}
