import { createApiClient } from '@ecom/api-client'
import { API_PORTS } from '@ecom/config'

const API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL ?? `http://localhost:${API_PORTS.admin}`

export const apiFetch = await createApiClient({ baseUrl: API_URL })
