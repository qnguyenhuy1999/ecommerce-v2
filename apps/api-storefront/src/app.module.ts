import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@ecom/redis';
import { EmailModule } from '@ecom/email';
import { DatabaseModule } from '@ecom/database';
import { getDefaultThrottleConfig, getRedisConfig, getSmtpConfig } from '@ecom/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [getDefaultThrottleConfig()],
    }),
    RedisModule.forRoot(getRedisConfig()),
    EmailModule.forRoot(getSmtpConfig()),
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}
