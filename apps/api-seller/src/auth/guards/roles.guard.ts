import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import type { SessionData } from '@ecom/auth'
import { ROLES_KEY } from '../decorators/roles.decorator'

type UserRequest = Request & { user?: SessionData }

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest<UserRequest>()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('Access denied')
    }

    const hasRole = user.roles.some((role) => requiredRoles.includes(role))
    if (!hasRole) {
      throw new ForbiddenException('Insufficient role permissions')
    }

    return true
  }
}
