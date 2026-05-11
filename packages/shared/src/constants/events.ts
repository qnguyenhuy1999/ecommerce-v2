/**
 * Domain event names used across the platform.
 * Producers emit these; consumers subscribe to them via the event bus or queue.
 */
export const EVENTS = {
  // Orders
  ORDER_CREATED: 'order.created',
  ORDER_PAID: 'order.paid',
  ORDER_SHIPPED: 'order.shipped',
  ORDER_DELIVERED: 'order.delivered',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_REFUNDED: 'order.refunded',

  // Products
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  PRODUCT_OUT_OF_STOCK: 'product.out_of_stock',
  PRODUCT_LOW_STOCK: 'product.low_stock',

  // Users
  USER_REGISTERED: 'user.registered',
  USER_VERIFIED: 'user.verified',
  USER_DEACTIVATED: 'user.deactivated',

  // Sellers
  SELLER_APPROVED: 'seller.approved',
  SELLER_SUSPENDED: 'seller.suspended',

  // Reviews
  REVIEW_CREATED: 'review.created',
  REVIEW_APPROVED: 'review.approved',
  REVIEW_REJECTED: 'review.rejected',

  // Notifications
  NOTIFICATION_SEND: 'notification.send',
} as const

export type EventName = (typeof EVENTS)[keyof typeof EVENTS]
