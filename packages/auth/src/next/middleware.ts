import { NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME } from '../cookie.config'

export interface WithAuthOptions {
  apiUrl?: string
  publicPaths?: string[]
  loginPath?: string
  requiredRole?: string
  requireSeller?: boolean
  meEndpoint?: string
  forbiddenRedirectTo?: string
}

export interface WithAuthRequest {
  nextUrl: { pathname: string }
  cookies: { get: (name: string) => { value?: string } | undefined }
  url: string
}

export function createWithAuth(options: WithAuthOptions = {}) {
  const {
    apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
    publicPaths = ['/login'],
    loginPath = '/login',
    requiredRole,
    requireSeller = false,
    meEndpoint = '/auth/me',
    forbiddenRedirectTo = '/',
  } = options

  return async function withAuth(request: WithAuthRequest) {
    const { pathname } = request.nextUrl

    if (publicPaths.some((p) => pathname.startsWith(p))) {
      return NextResponse.next()
    }

    const sid = request.cookies.get(SESSION_COOKIE_NAME)?.value
    if (!sid) {
      return NextResponse.redirect(new URL(loginPath, request.url))
    }

    try {
      const res = await fetch(`${apiUrl}${meEndpoint}`, {
        headers: { Cookie: `${SESSION_COOKIE_NAME}=${sid}` },
      })

      if (!res.ok) {
        const response = NextResponse.redirect(new URL(loginPath, request.url))
        response.cookies.delete('sid')
        return response
      }

      if (requiredRole || requireSeller) {
        const payload: unknown = await res.json()
        if (requiredRole) {
          const roles = parseRoles(payload)
          if (!roles.includes(requiredRole)) {
            return NextResponse.redirect(new URL(forbiddenRedirectTo, request.url))
          }
        }

        if (requireSeller && !hasSellerProfile(payload)) {
          return NextResponse.redirect(new URL(forbiddenRedirectTo, request.url))
        }
      }

      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL(loginPath, request.url))
    }
  }
}

function parseRoles(value: unknown): string[] {
  if (!value || typeof value !== 'object') return []
  const roles = (value as Record<string, unknown>).roles
  if (!Array.isArray(roles)) return []
  return roles.filter((role): role is string => typeof role === 'string')
}

function hasSellerProfile(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const sellerProfile = (value as Record<string, unknown>).sellerProfile
  return !!sellerProfile && typeof sellerProfile === 'object'
}
