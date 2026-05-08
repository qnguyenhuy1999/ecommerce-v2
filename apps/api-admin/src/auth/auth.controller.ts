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
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from '@ecom/auth';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AuditLog } from '../common/decorators/audit-log.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @AuditLog('ADMIN_LOGIN', '', {
    metadataExtractor: (result) => {
      const data = result as { data?: { id?: string } };
      return { adminId: data?.data?.id };
    },
  })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent'];
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.ip;

    const result = await this.authService.login(
      dto.email,
      dto.password,
      userAgent,
      ipAddress,
    );

    const cookieOptions = getSessionCookieOptions(process.env.COOKIE_DOMAIN);
    res.cookie(cookieOptions.name, result.sessionId, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge * 1000,
      ...(cookieOptions.domain ? { domain: cookieOptions.domain } : {}),
    });

    return { success: true, data: result.admin };
  }

  @Post('logout')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  @AuditLog('ADMIN_LOGOUT', '')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
    if (sessionId) {
      await this.authService.logout(sessionId);
    }

    const cookieOptions = getSessionCookieOptions(process.env.COOKIE_DOMAIN);
    res.clearCookie(cookieOptions.name, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      ...(cookieOptions.domain ? { domain: cookieOptions.domain } : {}),
    });

    return { success: true };
  }

  @Get('me')
  @UseGuards(AdminAuthGuard)
  async me(@Req() req: Request) {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
    const admin = await this.authService.getMe(sessionId);
    return { success: true, data: admin };
  }

  @Post('refresh')
  @UseGuards(AdminAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
    await this.authService.refreshSession(sessionId);
    return { success: true };
  }
}
