export const API_PORTS = {
  admin: 4002,
  seller: 4003,
  storefront: 4000,
} as const;

export const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000', // admin
  'http://localhost:3001', // seller
  'http://localhost:3002', // storefront
];

export function getCorsOrigins() {
  return process.env.CORS_ORIGINS?.split(',').map((o: string) => o.trim()) ?? DEFAULT_CORS_ORIGINS;
}

export const DEFAULT_LOW_STOCK_THRESHOLD = 10;
