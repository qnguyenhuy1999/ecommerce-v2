'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthContextValue, AuthUser } from './client'

export interface ProtectedRouteOptions {
  requiredRoles?: string[]
  requireSeller?: boolean
  redirectTo?: string
  onForbiddenRedirect?: (user: AuthUser) => string
  forbiddenRedirectTo?: string
}

export function useProtectedRoute(
  useAuth: () => AuthContextValue,
  options: ProtectedRouteOptions = {},
) {
  const { requiredRoles, requireSeller = false, redirectTo = '/login' } = options
  const { forbiddenRedirectTo = '/', onForbiddenRedirect } = options

  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace(redirectTo)
      return
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const roles = Array.isArray(user.roles) ? user.roles : []
      const hasRequired = requiredRoles.some((role) => roles.includes(role))
      if (!hasRequired) {
        const target = onForbiddenRedirect ? onForbiddenRedirect(user) : forbiddenRedirectTo
        router.replace(target)
      }
    }

    if (requireSeller && !hasSellerProfile(user)) {
      const target = onForbiddenRedirect ? onForbiddenRedirect(user) : forbiddenRedirectTo
      router.replace(target)
    }
  }, [
    forbiddenRedirectTo,
    loading,
    onForbiddenRedirect,
    redirectTo,
    requireSeller,
    requiredRoles,
    router,
    user,
  ])

  return { user, loading }
}

function hasSellerProfile(user: AuthUser): boolean {
  return !!user.sellerProfile && typeof user.sellerProfile === 'object'
}
