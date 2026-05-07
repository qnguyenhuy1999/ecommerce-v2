import { Module, forwardRef } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionProvider } from './session.provider';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [forwardRef(() => AuditLogsModule)],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionProvider,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AuthService, SessionProvider],
})
export class AuthModule {}
