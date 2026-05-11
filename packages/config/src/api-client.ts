export interface ApiOptions extends RequestInit {
  baseUrl?: string
  params?: Record<string, string | number | boolean | undefined>
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

export async function createApiClient(defaultOptions: { baseUrl: string }) {
  return async <T = unknown>(path: string, options: ApiOptions = {}): Promise<T> => {
    const { params, baseUrl, ...fetchOptions } = options
    const base = baseUrl ?? defaultOptions.baseUrl

    let url = `${base}${path}`

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
}
