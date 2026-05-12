import { createWithAuth } from '@ecom/auth/middleware'

export const withAuth = createWithAuth({
  publicPaths: ['/login', '/register', '/forgot-password'],
  loginPath: '/login',
  requiredRole: 'seller',
  forbiddenRedirectTo: '/login',
})
