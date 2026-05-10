export const FEATURE_FLAGS = {
  ENABLE_NEW_CHECKOUT: 'enable_new_checkout',
  USE_REDIS_CACHE: 'use_redis_cache',
  ENABLE_PRODUCT_REVIEWS: 'enable_product_reviews',
  ENABLE_WISHLIST: 'enable_wishlist',
  ENABLE_EMAIL_NOTIFICATIONS: 'enable_email_notifications',
  ENABLE_SMS_NOTIFICATIONS: 'enable_sms_notifications',
  ENABLE_DISCOUNTS: 'enable_discounts',
  ENABLE_GIFT_CARDS: 'enable_gift_cards',
  ENABLE_MULTI_CURRENCY: 'enable_multi_currency',
  ENABLE_INVENTORY_TRACKING: 'enable_inventory_tracking',
  ENABLE_BACKORDERS: 'enable_backorders',
  ENABLE_ANALYTICS: 'enable_analytics',
  MAINTENANCE_MODE: 'maintenance_mode',
} as const;

export type FeatureFlag = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

export const DEFAULT_FEATURE_FLAGS: Record<FeatureFlag, boolean> = {
  [FEATURE_FLAGS.ENABLE_NEW_CHECKOUT]: false,
  [FEATURE_FLAGS.USE_REDIS_CACHE]: true,
  [FEATURE_FLAGS.ENABLE_PRODUCT_REVIEWS]: true,
  [FEATURE_FLAGS.ENABLE_WISHLIST]: true,
  [FEATURE_FLAGS.ENABLE_EMAIL_NOTIFICATIONS]: true,
  [FEATURE_FLAGS.ENABLE_SMS_NOTIFICATIONS]: false,
  [FEATURE_FLAGS.ENABLE_DISCOUNTS]: true,
  [FEATURE_FLAGS.ENABLE_GIFT_CARDS]: false,
  [FEATURE_FLAGS.ENABLE_MULTI_CURRENCY]: false,
  [FEATURE_FLAGS.ENABLE_INVENTORY_TRACKING]: true,
  [FEATURE_FLAGS.ENABLE_BACKORDERS]: false,
  [FEATURE_FLAGS.ENABLE_ANALYTICS]: true,
  [FEATURE_FLAGS.MAINTENANCE_MODE]: false,
};
