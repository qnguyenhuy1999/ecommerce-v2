'use client'

import { withDefined } from '@ecom/shared/utils'

import { useProtectedRoute as useProtectedRouteBase } from '@ecom/auth/protected-route'
import type { AuthUser } from '@ecom/auth/client'
import { useAuth } from '../providers/auth-provider'

interface UseProtectedRouteOptions {
  requiredRoles?: string[]
  redirectTo?: string
}

function getForbiddenRedirect(user: AuthUser): string {
  if (user.sellerProfile && typeof user.sellerProfile === 'object') return '/seller/dashboard'
  return '/'
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { requiredRoles, redirectTo = '/login' } = options

  return useProtectedRouteBase(useAuth, {
    ...withDefined({ requiredRoles: requiredRoles }),
    redirectTo,
    onForbiddenRedirect: getForbiddenRedirect,
  })
}
