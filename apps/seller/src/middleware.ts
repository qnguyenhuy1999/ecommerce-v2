import type { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { withAuth } from './middleware/with-auth'

export async function middleware(request: NextRequest): Promise<NextResponse> {
  return await withAuth(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|register|forgot-password).*)'],
}
