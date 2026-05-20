import { apiFetch } from '@/lib/api'
import type { AdminOperations } from '@ecom/contracts/generated'

export interface AdminProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar: string | null
  emailVerified: boolean
  status: string
  roles: string[]
  permissions: string[]
}

type LoginResponse =
  AdminOperations['AuthController_login']['responses']['200']['content']['application/json'] & {
    data: AdminProfile
  }
type ProfileResponse =
  AdminOperations['AuthController_me']['responses']['200']['content']['application/json'] & {
    data: AdminProfile
  }
type LogoutResponse =
  AdminOperations['AuthController_logout']['responses']['200']['content']['application/json']

type LoginBody = {
  email: string
  password: string
}

export async function loginAdmin(email: string, password: string) {
  const body: LoginBody = { email, password }

  return apiFetch<LoginResponse>('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function logoutAdmin() {
  return apiFetch<LogoutResponse>('/admin/auth/logout', {
    method: 'POST',
  })
}

export async function getAdminProfile() {
  return apiFetch<ProfileResponse>('/admin/auth/me')
}
