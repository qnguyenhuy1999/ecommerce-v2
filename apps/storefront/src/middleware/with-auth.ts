import { createWithAuth } from '@ecom/auth/middleware'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withAuth: any = createWithAuth({
  publicPaths: ['/login', '/register', '/forgot-password'],
  loginPath: '/login',
})
