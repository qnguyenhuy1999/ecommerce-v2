'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthContextValue, AuthUser } from './client';

export interface ProtectedRouteOptions {
  requiredRoles?: string[];
  redirectTo?: string;
  onForbiddenRedirect?: (user: AuthUser) => string;
  forbiddenRedirectTo?: string;
}

export function useProtectedRoute(
  useAuth: () => AuthContextValue,
  options: ProtectedRouteOptions = {},
) {
  const { requiredRoles, redirectTo = '/login' } = options;
  const { forbiddenRedirectTo = '/', onForbiddenRedirect } = options;

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(redirectTo);
      return;
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequired = requiredRoles.some((role) => user.roles.includes(role));
      if (!hasRequired) {
        const target = onForbiddenRedirect
          ? onForbiddenRedirect(user)
          : forbiddenRedirectTo;
        router.replace(target);
      }
    }
  }, [
    forbiddenRedirectTo,
    loading,
    onForbiddenRedirect,
    redirectTo,
    requiredRoles,
    router,
    user,
  ]);

  return { user, loading };
}
