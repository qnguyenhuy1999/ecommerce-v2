import { getSchemaPath } from '@nestjs/swagger'
import { PaginationMetaDto } from '@ecom/contracts'
import { ApiResponseDto, PaginatedResponseDto } from '../dtos'

/**
 * Build an allOf schema wrapping a DTO inside ApiResponseDto<T>.
 *
 * Generic wrappers do NOT render correctly via plugin inference alone.
 * Use this inside @ApiOkResponse({ schema: buildApiResponseSchema(MyDto) })
 * and pair with @ApiExtraModels(ApiResponseDto, MyDto) — or use the
 * @ApiOkResponseData(MyDto) decorator which handles both automatically.
 *
 * @example
 * @ApiExtraModels(ApiResponseDto, UserDto)
 * @ApiOkResponse({ schema: buildApiResponseSchema(UserDto) })
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function buildApiResponseSchema(dtoClass: Function) {
  return {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { $ref: getSchemaPath(dtoClass) },
        },
      },
    ],
  }
}

/**
 * Build an allOf schema wrapping a DTO inside ApiResponseDto<T[]> (array variant).
 *
 * Use for endpoints that return a plain array (not paginated).
 * For paginated lists, use buildPaginatedResponseSchema() instead.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function buildApiArrayResponseSchema(dtoClass: Function) {
  return {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(dtoClass) },
          },
        },
      },
    ],
  }
}

/**
 * Build an allOf schema wrapping a DTO inside PaginatedResponseDto<T>.
 *
 * Produces the standard pagination envelope:
 * { success, data: { items: T[] }, meta: { pagination: PaginationMetaDto }, error: null }
 *
 * NOTE: Ensure @ApiExtraModels(PaginatedResponseDto, PaginationMetaDto, YourDto)
 * is applied on the controller or method so all $ref targets resolve.
 *
 * @example
 * @ApiExtraModels(PaginatedResponseDto, PaginationMetaDto, ProductDto)
 * @ApiOkResponse({ schema: buildPaginatedResponseSchema(ProductDto) })
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function buildPaginatedResponseSchema(dtoClass: Function) {
  return {
    allOf: [
      { $ref: getSchemaPath(PaginatedResponseDto) },
      {
        properties: {
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(dtoClass) },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              pagination: { $ref: getSchemaPath(PaginationMetaDto) },
            },
          },
        },
      },
    ],
  }
}
