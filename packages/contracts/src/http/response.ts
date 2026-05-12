export interface ApiErrorBody {
  code: string
  message: string
  details?: unknown
}

export interface ApiSuccessResponse<T = unknown> {
  success: true
  message?: string
  data?: T
  meta?: Record<string, unknown>
  timestamp: string
}

export interface ApiErrorResponse {
  success: false
  message?: string
  error: ApiErrorBody
  timestamp: string
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

export type ApiSuccess<T = unknown> = ApiSuccessResponse<T>
