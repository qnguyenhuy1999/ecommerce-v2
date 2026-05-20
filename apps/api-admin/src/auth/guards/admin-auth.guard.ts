import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common'
import type { Request } from 'express'
import type { SessionService } from '@ecom/auth'
import { SESSION_COOKIE_NAME } from '@ecom/auth'
import { SESSION_SERVICE } from '../session.provider'
import type { AdminSessionData } from '../decorators/current-admin.decorator'

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    @Inject(SESSION_SERVICE)
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const sessionId = getSessionIdFromRequest(request)

    if (!sessionId) {
      throw new UnauthorizedException('Authentication required')
    }

    const session = await this.sessionService.get(sessionId)
    if (!session) {
      throw new UnauthorizedException('Session expired or invalid')
    }

    const adminSession = toAdminSessionData(session)
    ;(request as Request & { admin: AdminSessionData }).admin = adminSession
    return true
  }
}

function getSessionIdFromRequest(req: Request): string | undefined {
  const cookies = req.cookies as unknown
  if (!cookies || typeof cookies !== 'object') return undefined
  const sessionId = (cookies as Record<string, unknown>)[SESSION_COOKIE_NAME]
  return typeof sessionId === 'string' ? sessionId : undefined
}

function toAdminSessionData(session: { [key: string]: unknown }): AdminSessionData {
  const adminId = session.adminId
  const permissions = session.permissions
  const roles = session.roles

  if (
    typeof adminId !== 'string' ||
    !Array.isArray(roles) ||
    !roles.every((role) => typeof role === 'string') ||
    !Array.isArray(permissions) ||
    !permissions.every((permission) => typeof permission === 'string')
  ) {
    throw new UnauthorizedException('Session payload is invalid')
  }

  return {
    adminId,
    roles,
    permissions,
  }
}
