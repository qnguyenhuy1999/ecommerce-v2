import { getAdminThrottleConfig, getRedisConfig, getSmtpConfig } from '@ecom/config'
import { DatabaseModule } from '@ecom/database'
import { EmailModule } from '@ecom/email'
import { RedisModule } from '@ecom/redis'
import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { AuditLogsModule } from './audit-logs/audit-logs.module'
import { AuthModule } from './auth/auth.module'
import { BannersModule } from './banners/banners.module'
import { CategoriesModule } from './categories/categories.module'
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor'
import { DashboardModule } from './dashboard/dashboard.module'
import { NotificationsModule } from './notifications/notifications.module'
import { OrdersModule } from './orders/orders.module'
import { ProductsModule } from './products/products.module'
import { PromotionsModule } from './promotions/promotions.module'
import { RefundsModule } from './refunds/refunds.module'
import { ReviewsModule } from './reviews/reviews.module'
import { SellersModule } from './sellers/sellers.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [getAdminThrottleConfig()],
    }),
    RedisModule.forRoot(
      (() => {
        const redis = getRedisConfig()
        return {
          host: redis.host,
          port: redis.port,
          ...(redis.password !== undefined ? { password: redis.password } : {}),
        }
      })(),
    ),
    EmailModule.forRoot(getSmtpConfig()),
    DatabaseModule,
    AuthModule,
    SellersModule,
    DashboardModule,
    AuditLogsModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    RefundsModule,
    UsersModule,
    PromotionsModule,
    BannersModule,
    NotificationsModule,
    ReviewsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
