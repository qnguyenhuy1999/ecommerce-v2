import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RedisProvider } from './redis.provider';
import { SessionProvider } from './session.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    RedisProvider,
    SessionProvider,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AuthService, SessionProvider],
})
export class AuthModule {}
