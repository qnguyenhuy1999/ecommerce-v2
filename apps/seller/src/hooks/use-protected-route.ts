'use client'

import { useProtectedRoute as useProtectedRouteBase } from '@ecom/auth/protected-route'
import { useAuth } from '../providers/auth-provider'

const REQUIRED_ROLES: string[] = ['seller']

export function useProtectedRoute() {
  return useProtectedRouteBase(useAuth, {
    requiredRoles: REQUIRED_ROLES,
    redirectTo: '/login',
    forbiddenRedirectTo: '/',
  })
}
