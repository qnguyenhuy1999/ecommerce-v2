// ─── Flash Sale Status ──────────────────────────────────────────
export const FlashSaleStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
  CANCELLED: 'CANCELLED',
} as const

export type FlashSaleStatus = (typeof FlashSaleStatus)[keyof typeof FlashSaleStatus]

// ─── Flash Sale Slot Status ─────────────────────────────────────
export const FlashSaleSlotStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SOLD_OUT: 'SOLD_OUT',
  CANCELLED: 'CANCELLED',
} as const

export type FlashSaleSlotStatus = (typeof FlashSaleSlotStatus)[keyof typeof FlashSaleSlotStatus]

// ─── Coupon Type ────────────────────────────────────────────────
export const CouponType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
  FREE_SHIPPING: 'FREE_SHIPPING',
} as const

export type CouponType = (typeof CouponType)[keyof typeof CouponType]

// ─── Coupon Status ──────────────────────────────────────────────
export const CouponStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  EXPIRED: 'EXPIRED',
  DEPLETED: 'DEPLETED',
} as const

export type CouponStatus = (typeof CouponStatus)[keyof typeof CouponStatus]

// ─── Coupon Scope ───────────────────────────────────────────────
export const CouponScope = {
  ALL_PRODUCTS: 'ALL_PRODUCTS',
  SPECIFIC_PRODUCTS: 'SPECIFIC_PRODUCTS',
  SPECIFIC_CATEGORIES: 'SPECIFIC_CATEGORIES',
} as const

export type CouponScope = (typeof CouponScope)[keyof typeof CouponScope]

// ─── Platform Voucher Type ──────────────────────────────────────
export const PlatformVoucherType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
} as const

export type PlatformVoucherType = (typeof PlatformVoucherType)[keyof typeof PlatformVoucherType]

// ─── Platform Voucher Status ────────────────────────────────────
export const PlatformVoucherStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  EXPIRED: 'EXPIRED',
} as const

export type PlatformVoucherStatus =
  (typeof PlatformVoucherStatus)[keyof typeof PlatformVoucherStatus]
