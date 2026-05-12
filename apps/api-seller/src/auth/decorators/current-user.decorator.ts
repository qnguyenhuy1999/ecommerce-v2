import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import type { Request } from 'express'
import type { SessionData } from '@ecom/auth'

type UserRequest = Request & { user?: SessionData }

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionData => {
    const request = ctx.switchToHttp().getRequest<UserRequest>()
    if (!request.user) {
      throw new Error('User session was not attached to request')
    }
    return request.user
  },
)
