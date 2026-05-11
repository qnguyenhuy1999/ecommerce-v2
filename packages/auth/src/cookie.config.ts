export interface CookieOptions {
  name: string
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict' | 'lax' | 'none'
  domain?: string
  path: string
  maxAge: number
}

export const SESSION_COOKIE_NAME = 'sid'

export function getSessionCookieOptions(domain?: string): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production'
  const sameSiteFromEnv = process.env.COOKIE_SAMESITE?.toLowerCase()
  const sameSite: CookieOptions['sameSite'] =
    sameSiteFromEnv === 'strict' || sameSiteFromEnv === 'lax' || sameSiteFromEnv === 'none'
      ? sameSiteFromEnv
      : 'lax'

  const secureFromEnv = process.env.COOKIE_SECURE
  const secureBase = secureFromEnv ? secureFromEnv === 'true' : isProduction
  const secure = sameSite === 'none' ? true : secureBase

  // Avoid using obvious placeholder domains in non-production environments
  let cookieDomain: string | undefined
  if (domain && domain !== '.yourdomain.com') {
    cookieDomain = domain
  } else if (isProduction) {
    cookieDomain = domain
  } else {
    cookieDomain = undefined
  }

  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure,
    sameSite,
    ...(cookieDomain !== undefined ? { domain: cookieDomain } : {}),
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  }
}
