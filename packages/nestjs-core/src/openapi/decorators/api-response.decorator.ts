import type { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, ApiCreatedResponse, getSchemaPath } from '@nestjs/swagger'
import { PaginationMetaDto } from '@ecom/contracts'
import { ApiResponseDto, PaginatedResponseDto } from '../dtos'

type SwaggerModel = Type<unknown> | string

const isSwaggerClass = (model: SwaggerModel): model is Type<unknown> => typeof model === 'function'

export const ApiOkResponseData = <TModel extends Type<unknown>>(model: TModel | string) => {
  const shouldReferenceModel = isSwaggerClass(model)
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, ...(shouldReferenceModel ? [model] : [])),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: shouldReferenceModel ? { $ref: getSchemaPath(model) } : { type: 'object' },
            },
          },
        ],
      },
    }),
  )
}

export const ApiCreatedResponseData = <TModel extends Type<unknown>>(model: TModel | string) => {
  const shouldReferenceModel = isSwaggerClass(model)
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, ...(shouldReferenceModel ? [model] : [])),
    ApiCreatedResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: shouldReferenceModel ? { $ref: getSchemaPath(model) } : { type: 'object' },
            },
          },
        ],
      },
    }),
  )
}

export const ApiPaginatedResponse = <TModel extends Type<unknown>>(model: TModel) => {
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
              meta: { $ref: getSchemaPath(PaginationMetaDto) },
            },
          },
        ],
      },
    }),
  )
}
