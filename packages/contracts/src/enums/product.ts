// ─── Product Status ─────────────────────────────────────────────
export const ProductStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
  REJECTED: 'REJECTED',
} as const

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus]

// ─── Review Status ──────────────────────────────────────────────
export const ReviewStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  HIDDEN: 'HIDDEN',
} as const

export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus]

// ─── Approval Status ────────────────────────────────────────────
export const ApprovalStatus = {
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
} as const

export type ApprovalStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus]

// ─── Product Report Reason ──────────────────────────────────────
export const ProductReportReason = {
  COUNTERFEIT: 'COUNTERFEIT',
  INAPPROPRIATE: 'INAPPROPRIATE',
  MISLEADING: 'MISLEADING',
  SAFETY_CONCERN: 'SAFETY_CONCERN',
  IP_VIOLATION: 'IP_VIOLATION',
  OTHER: 'OTHER',
} as const

export type ProductReportReason =
  (typeof ProductReportReason)[keyof typeof ProductReportReason]

// ─── Product Report Status ──────────────────────────────────────
export const ProductReportStatus = {
  OPEN: 'OPEN',
  REVIEWING: 'REVIEWING',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED',
} as const

export type ProductReportStatus =
  (typeof ProductReportStatus)[keyof typeof ProductReportStatus]
