import { type NextRequest, NextResponse } from 'next/server'
import { withAuth } from './middleware/with-auth'

export async function middleware(request: NextRequest): Promise<NextResponse> {
  return withAuth(request) as NextResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|register|forgot-password).*)'],
}
