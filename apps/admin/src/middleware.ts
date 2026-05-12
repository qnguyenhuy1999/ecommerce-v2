import type { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { createWithAuth } from '@ecom/auth/middleware'

const withAuth = createWithAuth({
  apiUrl: process.env.NEXT_PUBLIC_ADMIN_API_URL ?? 'http://localhost:4001',
  publicPaths: ['/login'],
  loginPath: '/login',
})

export async function middleware(request: NextRequest): Promise<NextResponse> {
  return withAuth(
    request as unknown as Parameters<typeof withAuth>[0],
  ) as unknown as Promise<NextResponse>
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
