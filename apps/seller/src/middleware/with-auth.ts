import { createWithAuth } from '@ecom/auth/middleware'

export const withAuth = createWithAuth({
  publicPaths: ['/login', '/register', '/forgot-password', '/reset-password'],
  loginPath: '/login',
  requireSeller: true,
  forbiddenRedirectTo: '/login',
})
