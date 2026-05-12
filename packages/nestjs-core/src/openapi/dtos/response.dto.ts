import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationMetaDto } from '@ecom/contracts'

/**
 * Swagger schema class for the canonical success response envelope.
 * Mirrors the ApiSuccessResponse<T> interface from @ecom/contracts.
 * Used only for OpenAPI schema generation — not for runtime validation.
 */
export class ApiResponseDto<T = unknown> {
  @ApiProperty({ example: true })
  success!: true

  @ApiProperty()
  data!: T

  @ApiPropertyOptional({ type: 'string', example: 'Operation completed successfully' })
  message?: string

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  meta?: Record<string, unknown>

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  timestamp!: string
}

/**
 * Swagger schema class for the canonical error response envelope.
 * Mirrors the ApiErrorResponse interface from @ecom/contracts.
 */
export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success!: false

  @ApiProperty({ example: 'The requested resource was not found.' })
  message!: string

  @ApiProperty({
    type: 'object',
    properties: {
      code: { type: 'string', example: 'NOT_FOUND' },
      message: { type: 'string', example: 'The requested resource was not found.' },
      details: { type: 'object', nullable: true, additionalProperties: true },
    },
    required: ['code', 'message'],
  })
  error!: {
    code: string
    message: string
    details?: unknown
  }

  @ApiProperty({ example: 404 })
  statusCode!: number

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  timestamp!: string

  @ApiProperty({ example: '/admin/products/123' })
  path!: string
}

/**
 * Swagger schema class for paginated success responses.
 * Mirrors the runtime output of the ResponseInterceptor for paginated data:
 * `{ success: true, data: { items: T[] }, meta: PaginationMeta, timestamp }`
 */
export class PaginatedResponseDto<T = unknown> {
  @ApiProperty({ example: true })
  success!: true

  @ApiProperty({
    type: 'object',
    properties: {
      items: { type: 'array', items: { type: 'object' } },
    },
    required: ['items'],
  })
  data!: { items: T[] }

  @ApiPropertyOptional({ type: 'string', example: 'Items fetched successfully' })
  message?: string

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  timestamp!: string
}
