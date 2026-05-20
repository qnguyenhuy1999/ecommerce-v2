import { createApiClient } from '@ecom/config/api-client'

const SELLER_API_PORT = 4003
const API_BASE = process.env.NEXT_PUBLIC_SELLER_API_URL ?? `http://localhost:${SELLER_API_PORT}`

export const api = createApiClient({ baseUrl: API_BASE })
export { ApiError } from '@ecom/config/api-client'
