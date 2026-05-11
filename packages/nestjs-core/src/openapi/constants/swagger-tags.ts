/**
 * Swagger tag constants for all three APIs.
 * Format: {App}/{Domain} — prevents Swagger UI chaos as APIs grow.
 *
 * Rules:
 * - Every controller gets exactly ONE @ApiTags() at the class level
 * - Sub-resources use slashes: Admin/Products/{productId}/Reviews
 * - No generic tags like CRUD, Misc, Default
 */

// Admin API tags
export const AdminTags = {
  AUTH: 'Admin/Auth',
  PRODUCTS: 'Admin/Products',
  CATEGORIES: 'Admin/Categories',
  ORDERS: 'Admin/Orders',
  USERS: 'Admin/Users',
  SELLERS: 'Admin/Sellers',
  REVIEWS: 'Admin/Reviews',
  PROMOTIONS: 'Admin/Promotions',
  BANNERS: 'Admin/Banners',
  NOTIFICATIONS: 'Admin/Notifications',
  REFUNDS: 'Admin/Refunds',
  AUDIT_LOGS: 'Admin/AuditLogs',
  DASHBOARD: 'Admin/Dashboard',
} as const;

// Seller API tags
export const SellerTags = {
  AUTH: 'Seller/Auth',
  PRODUCTS: 'Seller/Products',
  ORDERS: 'Seller/Orders',
  COUPONS: 'Seller/Coupons',
  SHIPPING: 'Seller/Shipping',
  FLASH_SALES: 'Seller/FlashSales',
  CHAT: 'Seller/Chat',
  ADS: 'Seller/Ads',
  WAREHOUSE: 'Seller/Warehouse',
  INVENTORY: 'Seller/Inventory',
  REVIEWS: 'Seller/Reviews',
  RETURNS: 'Seller/Returns',
  NOTIFICATIONS: 'Seller/Notifications',
  SHOP: 'Seller/Shop',
  WALLET: 'Seller/Wallet',
  APPROVAL: 'Seller/Approval',
  AFFILIATE: 'Seller/Affiliate',
  LOYALTY: 'Seller/Loyalty',
  SUBSCRIPTION: 'Seller/Subscription',
  GROWTH: 'Seller/Growth',
  AUTOMATION: 'Seller/Automation',
  BULK: 'Seller/Bulk',
  SEARCH: 'Seller/Search',
  LIVESTREAM: 'Seller/Livestream',
  AI_TOOLS: 'Seller/AiTools',
  I18N: 'Seller/I18n',
  EVENT_STREAMING: 'Seller/EventStreaming',
  RECOMMENDATION: 'Seller/Recommendation',
} as const;

// Storefront API tags
export const StorefrontTags = {
  AUTH: 'Storefront/Auth',
  PRODUCTS: 'Storefront/Products',
  CART: 'Storefront/Cart',
  CHECKOUT: 'Storefront/Checkout',
  ACCOUNT: 'Storefront/Account',
  ORDERS: 'Storefront/Orders',
  SEARCH: 'Storefront/Search',
} as const;
