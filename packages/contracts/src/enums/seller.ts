// ─── Shop Status ────────────────────────────────────────────────
export const ShopStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  CLOSED: 'CLOSED',
} as const

export type ShopStatus = (typeof ShopStatus)[keyof typeof ShopStatus]

// ─── Seller Status ──────────────────────────────────────────────
export const SellerStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
  REJECTED: 'REJECTED',
} as const

export type SellerStatus = (typeof SellerStatus)[keyof typeof SellerStatus]

// ─── Seller Verification Status ─────────────────────────────────
export const SellerVerificationStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  RESUBMITTED: 'RESUBMITTED',
} as const

export type SellerVerificationStatus =
  (typeof SellerVerificationStatus)[keyof typeof SellerVerificationStatus]

// ─── Subscription Status ────────────────────────────────────────
export const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]

// ─── Withdrawal Status ──────────────────────────────────────────
export const WithdrawalStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
} as const

export type WithdrawalStatus =
  (typeof WithdrawalStatus)[keyof typeof WithdrawalStatus]

// ─── Wallet Transaction Status ──────────────────────────────────
export const WalletTransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const

export type WalletTransactionStatus =
  (typeof WalletTransactionStatus)[keyof typeof WalletTransactionStatus]

// ─── Automation Status ──────────────────────────────────────────
export const AutomationStatus = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  DRAFT: 'DRAFT',
} as const

export type AutomationStatus =
  (typeof AutomationStatus)[keyof typeof AutomationStatus]
