export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  BUYER = 'BUYER',
  SUPPORT = 'SUPPORT',
}

export enum UserEventType {
  PRODUCT_VIEW = 'product_view',
  PRODUCT_CLICK = 'product_click',
  PRODUCT_SEARCH = 'product_search',
  ADD_TO_CART = 'add_to_cart',
  PURCHASE = 'purchase',
}
