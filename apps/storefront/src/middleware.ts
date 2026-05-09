import { type NextRequest, NextResponse } from 'next/server';
import { createWithAuth } from '@ecom/auth-next/middleware';

const withAuth = createWithAuth({
  publicPaths: ['/', '/products', '/search', '/login', '/register'],
  loginPath: '/login',
});

export async function middleware(request: NextRequest): Promise<NextResponse> {
  return withAuth(request as any) as any;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
