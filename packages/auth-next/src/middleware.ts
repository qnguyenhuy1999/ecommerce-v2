import { NextResponse, type NextRequest } from 'next/server';

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

    const sid = request.cookies.get('sid')?.value;
    if (!sid) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    try {
      const res = await fetch(`${apiUrl}/auth/me`, {
        headers: { Cookie: `sid=${sid}` },
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
