import type { ApiSuccessResponse } from '@ecom/contracts'

export type TypedApiResponse<T> = ApiSuccessResponse<T>

export type TypedApiSuccess = ApiSuccessResponse<never>
