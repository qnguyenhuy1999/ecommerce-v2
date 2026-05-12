/**
 * AUTO-GENERATED OpenAPI contract types.
 *
 * These types are generated from the committed OpenAPI JSON specs via:
 *   pnpm openapi:gen
 *
 * DO NOT edit these files manually. They are regenerated whenever
 * the OpenAPI specs change (pnpm swagger:gen:all && pnpm openapi:gen).
 *
 * Usage in frontend code (Phase 3+):
 *
 *   import type { paths as AdminPaths } from '@ecom/contracts/generated/admin'
 *   import type { paths as SellerPaths } from '@ecom/contracts/generated/seller'
 *   import type { paths as StorefrontPaths } from '@ecom/contracts/generated/storefront'
 *
 *   // Extract a specific endpoint response type:
 *   type LoginResponse =
 *     AdminPaths['/auth/login']['post']['responses']['200']['content']['application/json']
 */

export type {
  paths as AdminPaths,
  operations as AdminOperations,
  components as AdminComponents,
} from './admin'
export type {
  paths as SellerPaths,
  operations as SellerOperations,
  components as SellerComponents,
} from './seller'
export type {
  paths as StorefrontPaths,
  operations as StorefrontOperations,
  components as StorefrontComponents,
} from './storefront'
