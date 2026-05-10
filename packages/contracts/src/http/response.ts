export interface ApiResponse<T = unknown> {
  success: true
  data: T
  meta?: Record<string, unknown>
  timestamp: string
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  timestamp: string
}
