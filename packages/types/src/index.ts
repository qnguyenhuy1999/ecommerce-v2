// Product
export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'REJECTED';

// Order
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PACKING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// User
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';

// Admin
export type AdminStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type AdminPermission =
  | 'ADMIN_MANAGE'
  | 'ROLE_MANAGE'
  | 'SELLER_VIEW'
  | 'SELLER_APPROVE'
  | 'SELLER_SUSPEND'
  | 'PRODUCT_VIEW'
  | 'PRODUCT_MODERATE'
  | 'ORDER_VIEW'
  | 'ORDER_MANAGE'
  | 'REFUND_VIEW'
  | 'REFUND_MANAGE'
  | 'USER_VIEW'
  | 'USER_MANAGE'
  | 'MARKETING_MANAGE'
  | 'BANNER_MANAGE'
  | 'NOTIFICATION_MANAGE'
  | 'REVIEW_MODERATE'
  | 'CATEGORY_MANAGE'
  | 'AUDIT_VIEW'
  | 'SETTINGS_MANAGE'
  | 'DASHBOARD_VIEW';

// Seller
export type SellerStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'REJECTED';

// Shop
export type ShopStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
