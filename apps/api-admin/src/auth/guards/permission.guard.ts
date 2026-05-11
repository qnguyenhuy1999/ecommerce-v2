import type { CanActivate, ExecutionContext} from '@nestjs/common';
import { Injectable, ForbiddenException } from '@nestjs/common'
import type { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator'
import type { AdminSessionData } from '../decorators/current-admin.decorator'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const admin = (request as Request & { admin: AdminSessionData }).admin

    if (!admin) {
      throw new ForbiddenException('Access denied')
    }

    const hasPermission = requiredPermissions.some((p) => admin.permissions.includes(p))
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions')
    }

    return true
  }
}
