import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import type { Request } from 'express'
import type { SessionData } from '@ecom/auth'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionData => {
    const request = ctx.switchToHttp().getRequest<Request>()
    return (request as Request & { user: SessionData }).user
  },
)
