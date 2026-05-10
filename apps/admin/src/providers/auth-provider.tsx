'use client'

import { createAuthClient } from '@ecom/auth-next/client'

export const { AuthProvider, useAuth } = createAuthClient({
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  meEndpoint: '/admin/auth/me',
  loginEndpoint: '/admin/auth/login',
  logoutEndpoint: '/admin/auth/logout',
})
