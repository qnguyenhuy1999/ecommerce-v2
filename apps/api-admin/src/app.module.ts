import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@ecom/redis';
import { AuthModule } from './auth/auth.module';
import { SellersModule } from './sellers/sellers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 30 }],
    }),
    RedisModule.forRoot({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      password: process.env.REDIS_PASSWORD,
    }),
    AuthModule,
    SellersModule,
    DashboardModule,
    AuditLogsModule,
  ],
})
export class AppModule {}
