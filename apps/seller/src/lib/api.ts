import { createApiClient } from '@ecom/config/api-client'

const API_BASE = process.env.NEXT_PUBLIC_SELLER_API_URL ?? 'http://localhost:4001'

export const api = await createApiClient({ baseUrl: API_BASE })
export { ApiError } from '@ecom/config/api-client'
