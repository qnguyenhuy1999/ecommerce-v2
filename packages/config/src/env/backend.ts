import { z } from 'zod'

const LOCAL_PROTOCOL = 'http'
const DEFAULT_CORS_ORIGINS = ['localhost:3000', 'localhost:3001', 'localhost:3002'] as const
const DEFAULT_CORS_ORIGINS_VALUE = DEFAULT_CORS_ORIGINS.map(
  (origin) => `${LOCAL_PROTOCOL}://${origin}`,
).join(',')

export const backendEnvSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection string'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().min(1).max(65535).default(6379),
  REDIS_PASSWORD: z.string().optional(),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z.string().email().default('noreply@yourdomain.com'),
  APP_URL: z.string().url().default('http://localhost:3000'),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  COOKIE_SECURE: z
    .enum(['true', 'false', ''])
    .default('')
    .transform((v) => v === 'true'),
  CORS_ORIGINS: z
    .string()
    .default(DEFAULT_CORS_ORIGINS_VALUE)
    .transform((v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  STOREFRONT_API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  ADMIN_API_PORT: z.coerce.number().int().min(1).max(65535).default(4002),
  SELLER_API_PORT: z.coerce.number().int().min(1).max(65535).default(4003),
  THROTTLE_TTL_MS: z.coerce.number().int().positive().default(60000),
  THROTTLE_LIMIT: z.coerce.number().int().positive().default(10),
  THROTTLE_LIMIT_ADMIN: z.coerce.number().int().positive().default(30),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type BackendEnv = z.infer<typeof backendEnvSchema>

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
