export const CACHE_PREFIXES = {
  product: 'product',
  category: 'category',
  user: 'user',
  session: 'session',
  cart: 'cart',
  order: 'order',
  review: 'review',
} as const;

export const productDetail = (id: string | number): string => `${CACHE_PREFIXES.product}:${id}`;
export const productList = (filters: Record<string, unknown>): string => {
  const sorted = Object.entries(filters)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${String(v)}`)
    .join('&');
  return `${CACHE_PREFIXES.product}:list:${sorted}`;
};
export const productSlug = (slug: string): string => `${CACHE_PREFIXES.product}:slug:${slug}`;

export const userSession = (userId: string | number): string => `${CACHE_PREFIXES.session}:${userId}`;
export const userCart = (userId: string | number): string => `${CACHE_PREFIXES.cart}:${userId}`;

export const categoryTree = (): string => `${CACHE_PREFIXES.category}:tree`;
export const categoryById = (id: string | number): string => `${CACHE_PREFIXES.category}:${id}`;

export const orderById = (id: string | number): string => `${CACHE_PREFIXES.order}:${id}`;

export const reviewList = (productId: string | number, page: number): string =>
  `${CACHE_PREFIXES.review}:product:${productId}:page:${page}`;

export const TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
  WEEK: 604800, // 7 days
} as const;
