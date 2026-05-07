import { createWithAuth } from '@ecom/auth-next/middleware';

export const withAuth = createWithAuth({
  publicPaths: ['/login'],
  loginPath: '/login',
  requiredRole: 'seller',
  forbiddenRedirectTo: '/login',
});
