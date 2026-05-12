import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import type { Request } from 'express'

export interface AdminSessionData {
  adminId: string
  permissions: string[]
  roles: string[]
}

type AdminRequest = Request & { admin?: AdminSessionData }

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AdminSessionData => {
    const request = ctx.switchToHttp().getRequest<AdminRequest>()
    if (!request.admin) {
      throw new Error('Admin session was not attached to request')
    }
    return request.admin
  },
)
