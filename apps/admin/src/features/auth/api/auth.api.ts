import { apiFetch } from '@/lib/api'

export interface AdminProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar: string | null
  status: string
  roles: string[]
  permissions: string[]
}

export interface AuthResponse {
  success: boolean
  data: AdminProfile
}

export async function loginAdmin(email: string, password: string) {
  return apiFetch<AuthResponse>('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function logoutAdmin() {
  return apiFetch<{ success: boolean }>('/admin/auth/logout', {
    method: 'POST',
  })
}

export async function getAdminProfile() {
  return apiFetch<AuthResponse>('/admin/auth/me')
}
