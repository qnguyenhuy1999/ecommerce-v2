import { applyDecorators } from '@nestjs/common'
import { ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger'

export const ApiAuth = () => {
  return applyDecorators(ApiBearerAuth(), ApiCookieAuth('sessionId'))
}
