import { createApiClient } from '@ecom/config/api-client'
import { API_PORTS } from '@ecom/config'

const API_BASE = process.env.NEXT_PUBLIC_SELLER_API_URL ?? `http://localhost:${API_PORTS.seller}`

export const api = createApiClient({ baseUrl: API_BASE })
export { ApiError } from '@ecom/config/api-client'
