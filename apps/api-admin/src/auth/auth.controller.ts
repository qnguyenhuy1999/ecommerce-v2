import { ApiTags, ApiOperation } from '@nestjs/swagger'
import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import type { Request, Response } from 'express'
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from '@ecom/auth'
import { AuthService } from './auth.service'
import { LoginDto } from '@ecom/contracts'
import { AdminAuthGuard } from './guards/admin-auth.guard'
import { AuditLog } from '../common/decorators/audit-log.decorator'
import { ApiOkResponseData, ApiErrorResponses, ApiAuth } from '@ecom/nestjs-core/openapi'

@ApiTags('Admin/Auth')
@Controller('auth')
@ApiErrorResponses()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login to admin panel' })
  @ApiOkResponseData(Object)
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @AuditLog('ADMIN_LOGIN', '', {
    metadataExtractor: (result) => {
      const data = result as { data?: { id?: string } }
      return { adminId: data?.data?.id }
    },
  })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent']
    const ipAddress = getClientIp(req)

    const result = await this.authService.login(dto.email, dto.password, userAgent, ipAddress)

    const cookieOptions = getSessionCookieOptions(process.env.COOKIE_DOMAIN)
    res.cookie(cookieOptions.name, result.sessionId, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge * 1000,
      ...(cookieOptions.domain ? { domain: cookieOptions.domain } : {}),
    })

    return result.admin
  }

  @ApiOperation({ summary: 'Logout from admin panel' })
  @ApiOkResponseData(Object)
  @ApiAuth()
  @Post('logout')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @AuditLog('ADMIN_LOGOUT', '')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = getSessionIdFromRequest(req)
    if (sessionId) {
      await this.authService.logout(sessionId)
    }

    const cookieOptions = getSessionCookieOptions(process.env.COOKIE_DOMAIN)
    res.clearCookie(cookieOptions.name, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      ...(cookieOptions.domain ? { domain: cookieOptions.domain } : {}),
    })

    return { data: { success: true } }
  }

  @ApiOperation({ summary: 'Get current admin profile' })
  @ApiOkResponseData(Object)
  @ApiAuth()
  @Get('me')
  @UseGuards(AdminAuthGuard)
  async me(@Req() req: Request) {
    const sessionId = getSessionIdFromRequest(req)
    if (!sessionId) {
      throw new UnauthorizedException('No session cookie')
    }
    const admin = await this.authService.getMe(sessionId)
    return admin
  }

  @ApiOperation({ summary: 'Refresh session' })
  @ApiOkResponseData(Object)
  @ApiAuth()
  @Post('refresh')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const sessionId = getSessionIdFromRequest(req)
    if (!sessionId) {
      throw new UnauthorizedException('No session cookie')
    }
    await this.authService.refreshSession(sessionId)
    return { data: { success: true } }
  }
}

function getClientIp(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for']
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0]?.trim() ?? req.ip ?? ''
  }
  return req.ip ?? ''
}

function getSessionIdFromRequest(req: Request): string | undefined {
  const cookies = req.cookies as unknown
  if (!cookies || typeof cookies !== 'object') return undefined
  const sessionId = (cookies as Record<string, unknown>)[SESSION_COOKIE_NAME]
  return typeof sessionId === 'string' ? sessionId : undefined
}
