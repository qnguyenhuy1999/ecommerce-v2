import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common'
import type { Request } from 'express'

export interface AdminSessionData {
  adminId: string
  permissions: string[]
  roles: string[]
}

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AdminSessionData => {
    const request = ctx.switchToHttp().getRequest<Request>()
    return (request as Request & { admin: AdminSessionData }).admin
  },
)
