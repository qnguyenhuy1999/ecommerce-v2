import type {
  CanActivate,
  ExecutionContext} from '@nestjs/common';
import {
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'
import type { SessionService} from '@ecom/auth';
import { SESSION_COOKIE_NAME } from '@ecom/auth'
import { SESSION_SERVICE } from '../session.provider'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(SESSION_SERVICE)
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const sessionId = request.cookies?.[SESSION_COOKIE_NAME]

    if (!sessionId) {
      throw new UnauthorizedException('Authentication required')
    }

    const session = await this.sessionService.get(sessionId)
    if (!session) {
      throw new UnauthorizedException('Session expired or invalid')
    }

    ;(request as Request & { user: unknown }).user = session
    return true
  }
}
