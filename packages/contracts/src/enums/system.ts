// ─── Notification Status ────────────────────────────────────────
export const NotificationStatus = {
  DRAFT: 'DRAFT',
  UNREAD: 'UNREAD',
  READ: 'READ',
  ARCHIVED: 'ARCHIVED',
} as const

export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus]

// ─── Notification Type ──────────────────────────────────────────
export const NotificationType = {
  NEW_ORDER: 'NEW_ORDER',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  LOW_STOCK: 'LOW_STOCK',
  PRODUCT_REJECTED: 'PRODUCT_REJECTED',
  SYSTEM: 'SYSTEM',
} as const

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType]

// ─── Notification Channel ───────────────────────────────────────
export const NotificationChannel = {
  IN_APP: 'IN_APP',
  EMAIL: 'EMAIL',
  PUSH: 'PUSH',
} as const

export type NotificationChannel =
  (typeof NotificationChannel)[keyof typeof NotificationChannel]

// ─── Admin Notification Status ──────────────────────────────────
export const AdminNotificationStatus = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  FAILED: 'FAILED',
} as const

export type AdminNotificationStatus =
  (typeof AdminNotificationStatus)[keyof typeof AdminNotificationStatus]

// ─── Audit Actions ──────────────────────────────────────────────
export const AuditActions = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
  EXPORT: 'EXPORT',
} as const

export type AuditActions = (typeof AuditActions)[keyof typeof AuditActions]

// ─── Platform Event Status ──────────────────────────────────────
export const PlatformEventStatus = {
  PENDING: 'PENDING',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  REPLAYED: 'REPLAYED',
} as const

export type PlatformEventStatus =
  (typeof PlatformEventStatus)[keyof typeof PlatformEventStatus]
