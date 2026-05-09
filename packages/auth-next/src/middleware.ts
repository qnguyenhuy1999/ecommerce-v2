import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from '@ecom/auth';

export interface WithAuthOptions {
  apiUrl?: string;
  publicPaths?: string[];
  loginPath?: string;
  requiredRole?: string;
  forbiddenRedirectTo?: string;
}

export function createWithAuth(options: WithAuthOptions = {}) {
  const {
    apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
    publicPaths = ['/login'],
    loginPath = '/login',
    requiredRole,
    forbiddenRedirectTo = '/',
  } = options;

  return async function withAuth(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (publicPaths.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }

    const sid = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!sid) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    try {
      const res = await fetch(`${apiUrl}/auth/me`, {
        headers: { Cookie: `${SESSION_COOKIE_NAME}=${sid}` },
      });

      if (!res.ok) {
        const response = NextResponse.redirect(new URL(loginPath, request.url));
        response.cookies.delete('sid');
        return response;
      }

      if (requiredRole) {
        const data = (await res.json()) as { roles?: string[] };
        if (!data.roles?.includes(requiredRole)) {
          return NextResponse.redirect(new URL(forbiddenRedirectTo, request.url));
        }
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }
  };
}
