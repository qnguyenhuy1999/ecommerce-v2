'use client'

import { useProtectedRoute as useProtectedRouteBase } from '@ecom/auth/protected-route'
import { useAuth } from '../providers/auth-provider'

export function useProtectedRoute() {
  return useProtectedRouteBase(useAuth, {
    requireSeller: true,
    redirectTo: '/login',
    forbiddenRedirectTo: '/',
  })
}
