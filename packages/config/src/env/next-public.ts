import { z } from 'zod'

/**
 * Schema for NEXT_PUBLIC_* environment variables consumed by Next.js frontends.
 * These are embedded at build time and exposed to the browser.
 */
export const nextPublicEnvSchema = z.object({
  NEXT_PUBLIC_ADMIN_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_SELLER_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_STOREFRONT_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
})

export type NextPublicEnv = z.infer<typeof nextPublicEnvSchema>

/**
 * Parse and validate Next.js public environment variables.
 * Call this in next.config.ts or a shared env module.
 */
export function parseNextPublicEnv(
  env: Record<string, string | undefined> = process.env,
): NextPublicEnv {
  const result = nextPublicEnvSchema.safeParse(env)
  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    throw new Error(`\n❌ Next.js public env validation failed:\n${formatted}\n`)
  }
  return result.data
}
