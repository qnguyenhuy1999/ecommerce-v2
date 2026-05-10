export { SessionService, type SessionData, type SessionServiceOptions } from './session.service'

export { SESSION_COOKIE_NAME, getSessionCookieOptions, type CookieOptions } from './cookie.config'

export { getSessionId, hasRole, parseCookies, type AuthUser } from './helpers'

export * from './constants'
export * from './user-auth.base'
export * from './password.utils'
