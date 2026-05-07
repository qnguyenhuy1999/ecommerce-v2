const API_BASE = process.env.NEXT_PUBLIC_SELLER_API_URL ?? 'http://localhost:4001'

interface ApiOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

export async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options

  let url = `${API_BASE}${path}`

  if (params) {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value))
      }
    }
    const qs = searchParams.toString()
    if (qs) url += `?${qs}`
  }

  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.message ?? 'Request failed', body)
  }

  if (res.status === 204) return undefined as T

  return res.json()
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
