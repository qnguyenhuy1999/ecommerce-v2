// ─── User Status ────────────────────────────────────────────────
export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  BANNED: 'BANNED',
} as const

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

// ─── User Event Type ────────────────────────────────────────────
export const UserEventType = {
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  DELETED: 'DELETED',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  PRODUCT_VIEW: 'PRODUCT_VIEW',
  PRODUCT_CLICK: 'PRODUCT_CLICK',
} as const

export type UserEventType = (typeof UserEventType)[keyof typeof UserEventType]

// ─── Admin Status ───────────────────────────────────────────────
export const AdminStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const

export type AdminStatus = (typeof AdminStatus)[keyof typeof AdminStatus]

// ─── Admin Role Type ────────────────────────────────────────────
export const AdminRoleType = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  SUPPORT: 'SUPPORT',
  VIEWER: 'VIEWER',
} as const

export type AdminRoleType = (typeof AdminRoleType)[keyof typeof AdminRoleType]
