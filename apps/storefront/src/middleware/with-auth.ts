import { createWithAuth } from '@ecom/auth-next/middleware';

export const withAuth = createWithAuth({
  publicPaths: ['/login', '/register', '/forgot-password'],
  loginPath: '/login',
});
