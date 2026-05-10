// ---------------------------------------------------------------------------
// @ecom/config — Centralised, validated configuration helpers
//
// Rules:
//  - All process.env reads for shared infrastructure happen here.
//  - Helpers throw at startup if required values are missing or malformed.
//  - API apps import these helpers instead of parsing env vars inline.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Ports
// ---------------------------------------------------------------------------

export const API_PORTS = {
  admin: 4002,
  seller: 4003,
  storefront: 4000,
} as const

/**
 * Returns the port for the admin API.
 * Reads ADMIN_API_PORT first, falls back to the canonical default (4002).
 */
export function getAdminPort(): number {
  return _parsePort(process.env.ADMIN_API_PORT, API_PORTS.admin)
}

/**
 * Returns the port for the seller API.
 * Reads SELLER_API_PORT first, falls back to the canonical default (4003).
 */
export function getSellerPort(): number {
  return _parsePort(process.env.SELLER_API_PORT, API_PORTS.seller)
}

/**
 * Returns the port for the storefront API.
 * Reads STOREFRONT_API_PORT first, falls back to the canonical default (4000).
 */
export function getStorefrontPort(): number {
  return _parsePort(process.env.STOREFRONT_API_PORT, API_PORTS.storefront)
}

// ---------------------------------------------------------------------------
// Redis
// ---------------------------------------------------------------------------

export interface RedisConfig {
  host: string
  port: number
  password: string | undefined
}

/**
 * Returns validated Redis connection settings.
 * Throws if REDIS_PORT is present but not a valid integer.
 */
export function getRedisConfig(): RedisConfig {
  return {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: _parsePort(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD || undefined,
  }
}

// ---------------------------------------------------------------------------
// SMTP / Email
// ---------------------------------------------------------------------------

export interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
  from: string
}

/**
 * Returns validated SMTP settings.
 * Throws if SMTP_PORT is present but not a valid integer.
 */
export function getSmtpConfig(): SmtpConfig {
  return {
    host: process.env.SMTP_HOST ?? 'localhost',
    port: _parsePort(process.env.SMTP_PORT, 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER ?? '',
      pass: process.env.SMTP_PASS ?? '',
    },
    from: process.env.SMTP_FROM ?? 'noreply@yourdomain.com',
  }
}

// ---------------------------------------------------------------------------
// Throttling
// ---------------------------------------------------------------------------

export interface ThrottleConfig {
  ttl: number
  limit: number
}

/**
 * Returns throttle settings for admin APIs (higher limit — internal tooling).
 * Reads THROTTLE_TTL_MS / THROTTLE_LIMIT_ADMIN from env; falls back to defaults.
 */
export function getAdminThrottleConfig(): ThrottleConfig {
  return {
    ttl: _parsePositiveInt(process.env.THROTTLE_TTL_MS, 60_000),
    limit: _parsePositiveInt(process.env.THROTTLE_LIMIT_ADMIN, 30),
  }
}

/**
 * Returns throttle settings for seller / storefront APIs (stricter limit).
 * Reads THROTTLE_TTL_MS / THROTTLE_LIMIT from env; falls back to defaults.
 */
export function getDefaultThrottleConfig(): ThrottleConfig {
  return {
    ttl: _parsePositiveInt(process.env.THROTTLE_TTL_MS, 60_000),
    limit: _parsePositiveInt(process.env.THROTTLE_LIMIT, 10),
  }
}

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

export const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000', // storefront
  'http://localhost:3001', // seller
  'http://localhost:3002', // admin
] as const

/**
 * Returns the list of allowed CORS origins.
 *
 * When CORS_ORIGINS is set, each entry is trimmed and validated as an
 * absolute URL. Invalid entries cause a startup error rather than silently
 * allowing malformed origins.
 *
 * Falls back to DEFAULT_CORS_ORIGINS when the env var is absent.
 */
export function getCorsOrigins(): string[] {
  const raw = process.env.CORS_ORIGINS
  if (!raw) {
    return [...DEFAULT_CORS_ORIGINS]
  }

  const origins = raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

  if (origins.length === 0) {
    throw new Error(
      'CORS_ORIGINS is set but contains no valid entries after trimming. ' +
        'Provide a comma-separated list of absolute URLs or unset the variable.',
    )
  }

  for (const origin of origins) {
    _validateOriginUrl(origin)
  }

  return origins
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

export const DEFAULT_LOW_STOCK_THRESHOLD = 10

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function _parsePort(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw === '') return fallback
  const n = parseInt(raw, 10)
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    throw new Error(
      `Invalid port value "${raw}". Expected an integer between 1 and 65535.`,
    )
  }
  return n
}

function _parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw === '') return fallback
  const n = parseInt(raw, 10)
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(
      `Invalid positive integer value "${raw}". Expected a positive integer.`,
    )
  }
  return n
}

function _validateOriginUrl(origin: string): void {
  try {
    const url = new URL(origin)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error(`Unsupported protocol "${url.protocol}"`)
    }
  } catch {
    throw new Error(
      `Invalid CORS origin "${origin}". Each entry in CORS_ORIGINS must be an ` +
        'absolute URL with an http or https scheme (e.g. "https://example.com").',
    )
  }
}
