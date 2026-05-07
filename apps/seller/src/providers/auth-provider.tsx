'use client';

import { createAuthClient, type AuthUser } from '@ecom/auth-next/client';

export type { AuthUser };

export const { AuthProvider, useAuth } = createAuthClient({
  requiredRole: 'seller',
  forbiddenRedirectTo: '/',
});
