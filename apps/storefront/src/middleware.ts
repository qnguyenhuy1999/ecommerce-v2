import { type NextRequest } from 'next/server'
import { createWithAuth } from '@ecom/auth/middleware'

const withAuth = createWithAuth({
  publicPaths: ['/', '/products', '/search', '/login', '/register'],
  loginPath: '/login',
})

export async function middleware(request: NextRequest): Promise<Response> {
  return withAuth(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
