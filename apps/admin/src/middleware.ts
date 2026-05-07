import { createWithAuth } from '@ecom/auth-next/middleware';

export const middleware = createWithAuth({
  apiUrl: process.env.NEXT_PUBLIC_ADMIN_API_URL ?? 'http://localhost:4001',
  publicPaths: ['/login'],
  loginPath: '/login',
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
