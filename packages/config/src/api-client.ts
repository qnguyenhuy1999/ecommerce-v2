export type ApiParams = Record<string, string | number | boolean>
export type ApiParamsInput = Record<string, string | number | boolean | null | undefined>

export const API_PORTS = {
  admin: 4002,
  seller: 4003,
  storefront: 4000,
} as const

export interface ApiOptions extends RequestInit {
  baseUrl?: string
  params?: ApiParamsInput
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

function isApiErrorBody(value: unknown): value is Record<string, unknown> & { message?: string } {
  return !!value && typeof value === 'object'
}

export function createApiClient(defaultOptions: { baseUrl: string }) {
  return async <T = unknown>(path: string, options: ApiOptions = {}): Promise<T> => {
    const { params, baseUrl, ...fetchOptions } = options
    const base = baseUrl ?? defaultOptions.baseUrl

    let url = `${base}${path}`

    if (params) {
      const searchParams = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
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
      const body: unknown = await res.json().catch(() => ({}))
      const message =
        isApiErrorBody(body) && typeof body.message === 'string' ? body.message : 'Request failed'
      throw new ApiError(res.status, message, isApiErrorBody(body) ? body : undefined)
    }

    if (res.status === 204) return undefined as unknown as T

    return (await res.json()) as T
  }
}
