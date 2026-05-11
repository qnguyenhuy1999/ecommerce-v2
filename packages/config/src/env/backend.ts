import { z } from 'zod'

/**
 * Shared backend environment schema.
 * Each NestJS app should parse process.env through this at bootstrap.
 * Apps can extend this schema with app-specific variables.
 */
export const backendEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection string'),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().min(1).max(65535).default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // SMTP
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z.string().email().default('noreply@yourdomain.com'),

  // App
  APP_URL: z.string().url().default('http://localhost:3000'),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  COOKIE_SECURE: z
    .enum(['true', 'false', ''])
    .default('')
    .transform((v) => v === 'true'),
  CORS_ORIGINS: z
    .string()
    // eslint-disable-next-line sonarjs/no-clear-text-protocols -- localhost dev defaults, not production URLs
    .default('http://localhost:3000,http://localhost:3001,http://localhost:3002')
    .transform((v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ),

  // Ports
  STOREFRONT_API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  ADMIN_API_PORT: z.coerce.number().int().min(1).max(65535).default(4002),
  SELLER_API_PORT: z.coerce.number().int().min(1).max(65535).default(4003),

  // Throttling
  THROTTLE_TTL_MS: z.coerce.number().int().positive().default(60000),
  THROTTLE_LIMIT: z.coerce.number().int().positive().default(10),
  THROTTLE_LIMIT_ADMIN: z.coerce.number().int().positive().default(30),

  // Auth
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),

  // Node
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type BackendEnv = z.infer<typeof backendEnvSchema>

/**
 * Parse and validate backend environment variables.
 * Call this at the top of each NestJS app's bootstrap function.
 * Throws a descriptive error and exits if validation fails.
 */
export function parseBackendEnv(env: Record<string, string | undefined> = process.env): BackendEnv {
  const result = backendEnvSchema.safeParse(env)
  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    console.error(`\n❌ Environment validation failed:\n${formatted}\n`)
    process.exit(1)
  }
  return result.data
}
