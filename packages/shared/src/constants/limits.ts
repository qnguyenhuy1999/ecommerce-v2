export const PRODUCT_LIMITS = {
  maxNameLength: 255,
  maxDescriptionLength: 5000,
  maxImages: 10,
  maxVariants: 100,
  maxTags: 20,
  maxMetaTitleLength: 70,
  maxMetaDescriptionLength: 160,
} as const

export const INVENTORY_DEFAULTS = {
  defaultLowStockThreshold: 5,
  defaultMaxReservations: 10,
  defaultBackorderLimit: 50,
} as const

export const ORDER_LIMITS = {
  maxItemsPerOrder: 50,
  maxQuantityPerItem: 999,
  maxDiscountPercentage: 90,
} as const

export const USER_LIMITS = {
  maxAddressesPerUser: 10,
  maxWishlistItems: 100,
  maxReviewsPerUser: 50,
} as const
