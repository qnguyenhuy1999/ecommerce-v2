import { NextResponse, type NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const PUBLIC_PATHS = ['/login'];

export async function withAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const sid = request.cookies.get('sid')?.value;
  if (!sid) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Cookie: `sid=${sid}` },
    });

    if (!res.ok) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('sid');
      return response;
    }

    const data = await res.json();
    if (!data.roles?.includes('admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}
