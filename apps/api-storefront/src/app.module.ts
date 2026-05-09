import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@ecom/redis';
import { EmailModule } from '@ecom/email';
import { DatabaseModule } from '@ecom/database';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 10 }],
    }),
    RedisModule.forRoot({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      password: process.env.REDIS_PASSWORD,
    }),
    EmailModule.forRoot({
      host: process.env.SMTP_HOST ?? 'localhost',
      port: parseInt(process.env.SMTP_PORT ?? '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER ?? '',
        pass: process.env.SMTP_PASS ?? '',
      },
      from: process.env.SMTP_FROM ?? 'noreply@yourdomain.com',
    }),
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}
