export const API_PREFIX = '/api'

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',
} as const

export const PRODUCT_ROUTES = {
  BASE: '/products',
  BY_ID: (id: string | number) => `/products/${id}`,
  BY_SLUG: (slug: string) => `/products/slug/${slug}`,
  CATEGORIES: '/products/categories',
  CATEGORY_BY_SLUG: (slug: string) => `/products/categories/${slug}`,
  REVIEWS: (productId: string | number) => `/products/${productId}/reviews`,
  VARIANTS: (productId: string | number) => `/products/${productId}/variants`,
} as const

export const CART_ROUTES = {
  BASE: '/cart',
  ITEMS: '/cart/items',
  ITEM_BY_ID: (id: string | number) => `/cart/items/${id}`,
  CHECKOUT: '/cart/checkout',
} as const

export const ORDER_ROUTES = {
  BASE: '/orders',
  BY_ID: (id: string | number) => `/orders/${id}`,
  STATUS: (id: string | number) => `/orders/${id}/status`,
  TRACKING: (id: string | number) => `/orders/${id}/tracking`,
} as const

export const USER_ROUTES = {
  BASE: '/users',
  PROFILE: '/users/profile',
  ADDRESSES: '/users/addresses',
  ADDRESS_BY_ID: (id: string | number) => `/users/addresses/${id}`,
  WISHLIST: '/users/wishlist',
  WISHLIST_ITEM: (id: string | number) => `/users/wishlist/${id}`,
} as const

export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  PRODUCTS: '/admin/products',
  PRODUCT_EDIT: (id: string | number) => `/admin/products/${id}/edit`,
  ORDERS: '/admin/orders',
  ORDER_DETAIL: (id: string | number) => `/admin/orders/${id}`,
  USERS: '/admin/users',
  USER_EDIT: (id: string | number) => `/admin/users/${id}/edit`,
  SETTINGS: '/admin/settings',
} as const
