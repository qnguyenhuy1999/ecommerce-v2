import type { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, ApiCreatedResponse, getSchemaPath } from '@nestjs/swagger'
import { PaginationMetaDto } from '@ecom/contracts'
import { ApiResponseDto, PaginatedResponseDto } from '../dtos'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiOkResponseData = <TModel extends Type<any>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: TModel | string | any,
) => {
  const isType = typeof model === 'function'
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, ...(isType ? [model] : [])),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: isType ? { $ref: getSchemaPath(model) } : { type: 'object' },
            },
          },
        ],
      },
    }),
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiCreatedResponseData = <TModel extends Type<any>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: TModel | string | any,
) => {
  const isType = typeof model === 'function'
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, ...(isType ? [model] : [])),
    ApiCreatedResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: isType ? { $ref: getSchemaPath(model) } : { type: 'object' },
            },
          },
        ],
      },
    }),
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(PaginatedResponseDto, PaginationMetaDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                },
              },
            },
          },
        ],
      },
    }),
  )
}
