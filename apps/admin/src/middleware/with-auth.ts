import { createWithAuth } from '@ecom/auth-next/middleware';

export const withAuth = createWithAuth({
  publicPaths: ['/login'],
  loginPath: '/login',
  requiredRole: 'admin',
  forbiddenRedirectTo: '/login',
});
