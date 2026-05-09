export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  REJECTED = 'REJECTED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  HIDDEN = 'HIDDEN',
  REJECTED = 'REJECTED',
}

export const PRODUCT_LIMITS = {
  MAX_IMAGES: 10,
  MAX_VARIANTS: 50,
  MIN_PRICE: 0.01,
} as const;
