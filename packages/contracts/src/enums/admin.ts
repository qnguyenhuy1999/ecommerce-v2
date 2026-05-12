// ─── Banner Position ────────────────────────────────────────────
export const BannerPosition = {
  HERO: 'HERO',
  HOMEPAGE_TOP: 'HOMEPAGE_TOP',
  HOMEPAGE_MIDDLE: 'HOMEPAGE_MIDDLE',
  CAMPAIGN: 'CAMPAIGN',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
} as const

export type BannerPosition =
  (typeof BannerPosition)[keyof typeof BannerPosition]

// ─── Banner Status ──────────────────────────────────────────────
export const BannerStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
} as const

export type BannerStatus = (typeof BannerStatus)[keyof typeof BannerStatus]

// ─── Bulk Job Status ────────────────────────────────────────────
export const BulkJobStatus = {
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  PARTIALLY_COMPLETED: 'PARTIALLY_COMPLETED',
} as const

export type BulkJobStatus = (typeof BulkJobStatus)[keyof typeof BulkJobStatus]

// ─── Bulk Job Type ──────────────────────────────────────────────
export const BulkJobType = {
  PRODUCT_IMPORT: 'PRODUCT_IMPORT',
  PRODUCT_EXPORT: 'PRODUCT_EXPORT',
  INVENTORY_UPDATE: 'INVENTORY_UPDATE',
  PRICE_UPDATE: 'PRICE_UPDATE',
} as const

export type BulkJobType = (typeof BulkJobType)[keyof typeof BulkJobType]
