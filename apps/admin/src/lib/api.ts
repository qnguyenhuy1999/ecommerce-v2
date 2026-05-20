import { createApiClient } from '@ecom/config/api-client'

const ADMIN_API_PORT = 4002
const API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? `http://localhost:${ADMIN_API_PORT}`

export const apiFetch = createApiClient({ baseUrl: API_URL })
