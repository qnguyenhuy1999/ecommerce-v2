'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';

interface UseProtectedRouteOptions {
  requiredRoles?: string[];
  redirectTo?: string;
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { requiredRoles, redirectTo = '/login' } = options;
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(redirectTo);
      return;
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequired = requiredRoles.some((role) =>
        user.roles.includes(role),
      );
      if (!hasRequired) {
        // Role-based redirect
        if (user.roles.includes('seller')) {
          router.replace('/seller/dashboard');
        } else if (user.roles.includes('admin')) {
          router.replace('/admin');
        } else {
          router.replace('/');
        }
      }
    }
  }, [user, loading, router, requiredRoles, redirectTo]);

  return { user, loading };
}
