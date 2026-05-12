import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import type { Request, Response } from 'express'
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from '@ecom/auth'
import type { RegisterDto, LoginDto } from '@ecom/contracts'
import {
  ApiErrorResponses,
  ApiOkResponseData,
  ApiCreatedResponseData,
} from '@ecom/nestjs-core/openapi'
import type { AuthService } from './auth.service'

@ApiTags('Storefront/Auth')
@ApiErrorResponses()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponseData('any')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto.email, dto.password)
    return { user }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and receive session cookie' })
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData('any')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent']
    const ipAddress = getClientIp(req)

    const { sessionId, userId, roles } = await this.authService.login(
      dto.email,
      dto.password,
      userAgent,
      ipAddress,
    )

    const cookieOptions = getSessionCookieOptions(process.env.COOKIE_DOMAIN)
    res.cookie(cookieOptions.name, sessionId, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge * 1000,
      ...(cookieOptions.domain ? { domain: cookieOptions.domain } : {}),
    })

    return { user: { userId, roles } }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and clear session cookie' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData('any')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = getCookieValue(req, SESSION_COOKIE_NAME)
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

  @Get('me')
  @ApiOperation({ summary: 'Get current user session info' })
  @ApiOkResponseData('any')
  async me(@Req() req: Request) {
    const sessionId = getCookieValue(req, SESSION_COOKIE_NAME)
    if (!sessionId) {
      throw new UnauthorizedException('No session cookie')
    }

    const session = await this.authService.getMe(sessionId)
    return { userId: session.userId, roles: session.roles }
  }
}

function getClientIp(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for']
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0]?.trim() ?? req.ip ?? ''
  }
  return req.ip ?? ''
}

function getCookieValue(req: Request, key: string): string | undefined {
  const cookies = req.cookies as Record<string, unknown> | undefined
  const value = cookies?.[key]
  return typeof value === 'string' ? value : undefined
}
