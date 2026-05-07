'use client';

import { useProtectedRoute as useProtectedRouteBase } from '@ecom/auth-next/protected-route';
import { useAuth } from '../providers/auth-provider';

export function useProtectedRoute() {
  return useProtectedRouteBase(useAuth, {
    requiredRoles: ['admin'],
    redirectTo: '/login',
    forbiddenRedirectTo: '/',
  });
}
