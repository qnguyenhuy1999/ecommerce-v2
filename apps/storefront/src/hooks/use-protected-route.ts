'use client'

import { useProtectedRoute as useProtectedRouteBase } from '@ecom/auth-next/protected-route'
import type { AuthUser } from '@ecom/auth-next/client'
import { useAuth } from '../providers/auth-provider'

interface UseProtectedRouteOptions {
  requiredRoles?: string[]
  redirectTo?: string
}

function getForbiddenRedirect(user: AuthUser): string {
  if (user.roles.includes('seller')) return '/seller/dashboard'
  if (user.roles.includes('admin')) return '/admin'
  return '/'
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { requiredRoles, redirectTo = '/login' } = options

  return useProtectedRouteBase(useAuth, {
    requiredRoles,
    redirectTo,
    onForbiddenRedirect: getForbiddenRedirect,
  })
}
