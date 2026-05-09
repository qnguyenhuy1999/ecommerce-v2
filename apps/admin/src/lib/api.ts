import { createApiClient } from '@ecom/api-client';

const API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL ?? 'http://localhost:4001';

export const apiFetch = await createApiClient({ baseUrl: API_URL });
