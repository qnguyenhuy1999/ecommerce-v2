'use client'

import { createAuthClient, type AuthUser } from '@ecom/auth/client'

export type { AuthUser }

export const { AuthProvider, useAuth } = createAuthClient({
  requiredRole: 'seller',
  forbiddenRedirectTo: '/',
})
