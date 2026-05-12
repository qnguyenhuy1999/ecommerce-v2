/**
 * Stable error code taxonomy for all APIs.
 * These codes are API contracts — frontend/mobile apps depend on them for
 * error handling and i18n. Do NOT rename or remove existing codes.
 *
 * Naming convention: DOMAIN_REASON (uppercase, underscore-separated)
 */
export const ErrorCodes = {
  // ─── Generic / HTTP-level ───────────────────────────────────────────
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',

  // ─── Auth ───────────────────────────────────────────────────────────
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  AUTH_EMAIL_NOT_VERIFIED: 'AUTH_EMAIL_NOT_VERIFIED',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',

  // ─── Product ────────────────────────────────────────────────────────
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  PRODUCT_OUT_OF_STOCK: 'PRODUCT_OUT_OF_STOCK',
  PRODUCT_SKU_DUPLICATE: 'PRODUCT_SKU_DUPLICATE',

  // ─── Order ──────────────────────────────────────────────────────────
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  ORDER_WRONG_STATUS: 'ORDER_WRONG_STATUS',
  ORDER_PAYMENT_FAILED: 'ORDER_PAYMENT_FAILED',
  ORDER_REFUND_EXCEEDED: 'ORDER_REFUND_EXCEEDED',

  // ─── User ──────────────────────────────────────────────────────────
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_EMAIL_DUPLICATE: 'USER_EMAIL_DUPLICATE',
  USER_INSUFFICIENT_PERMISSIONS: 'USER_INSUFFICIENT_PERMISSIONS',

  // ─── Validation (specific) ─────────────────────────────────────────
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',

  // ─── Database / Prisma (mapped) ────────────────────────────────────
  UNIQUE_CONSTRAINT_VIOLATION: 'UNIQUE_CONSTRAINT_VIOLATION',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  FOREIGN_KEY_CONSTRAINT_VIOLATION: 'FOREIGN_KEY_CONSTRAINT_VIOLATION',
  RELATION_VIOLATION: 'RELATION_VIOLATION',

  // ─── System ─────────────────────────────────────────────────────────
  SYSTEM_INTERNAL_ERROR: 'SYSTEM_INTERNAL_ERROR',
  SYSTEM_RATE_LIMITED: 'SYSTEM_RATE_LIMITED',
  SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE',

  // ─── Seller ─────────────────────────────────────────────────────────
  SELLER_NOT_FOUND: 'SELLER_NOT_FOUND',
  SELLER_NOT_APPROVED: 'SELLER_NOT_APPROVED',
  SELLER_SUSPENDED: 'SELLER_SUSPENDED',

  // ─── Category ───────────────────────────────────────────────────────
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  CATEGORY_HAS_CHILDREN: 'CATEGORY_HAS_CHILDREN',

  // ─── Promotion / Coupon ─────────────────────────────────────────────
  COUPON_NOT_FOUND: 'COUPON_NOT_FOUND',
  COUPON_EXPIRED: 'COUPON_EXPIRED',
  COUPON_USAGE_EXCEEDED: 'COUPON_USAGE_EXCEEDED',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]
