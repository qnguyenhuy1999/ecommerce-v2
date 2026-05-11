import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  Query,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import type { Request, Response } from 'express'
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from '@ecom/auth'
import {
  ApiOkResponseData,
  ApiCreatedResponseData,
  ApiErrorResponses,
} from '@ecom/nestjs-core/openapi'
import type { LoginDto } from '@ecom/contracts'
import type { AuthService } from './auth.service'
import type { RegisterDto } from './dto/register.dto'
import type { ForgotPasswordDto } from './dto/forgot-password.dto'
import type { ResetPasswordDto } from './dto/reset-password.dto'

@ApiTags('Seller/Auth')
@ApiErrorResponses()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponseData(Object)
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto.email, dto.password, dto.shopName)
    return user
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(Object)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent']
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.ip

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

    return { userId, roles }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(Object)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME]
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

    return { message: 'Logged out' }
  }

  @Get('me')
  @ApiOkResponseData(Object)
  async me(@Req() req: Request) {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME]
    if (!sessionId) {
      throw new UnauthorizedException('No session cookie')
    }
    return this.authService.getMe(sessionId)
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(Object)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email)
    return { message: 'If that email exists, a reset link has been sent' }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(Object)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password)
    return { message: 'Password reset successful' }
  }

  @Get('verify-email')
  @ApiOkResponseData(Object)
  async verifyEmail(@Query('token') token: string) {
    await this.authService.verifyEmail(token)
    return { message: 'Email verified successfully' }
  }
}
