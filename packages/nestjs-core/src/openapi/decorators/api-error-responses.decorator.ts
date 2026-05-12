import { applyDecorators } from '@nestjs/common'
import {
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger'
import { ErrorResponseDto } from '../dtos'

export const ApiErrorResponses = () => {
  return applyDecorators(
    ApiExtraModels(ErrorResponseDto),
    ApiBadRequestResponse({
      description: 'Bad Request',
      schema: { $ref: getSchemaPath(ErrorResponseDto) },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: { $ref: getSchemaPath(ErrorResponseDto) },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: { $ref: getSchemaPath(ErrorResponseDto) },
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
      schema: { $ref: getSchemaPath(ErrorResponseDto) },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      schema: { $ref: getSchemaPath(ErrorResponseDto) },
    }),
  )
}
