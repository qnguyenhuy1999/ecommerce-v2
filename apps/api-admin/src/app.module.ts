import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { RedisModule } from '@ecom/redis'
import { DatabaseModule } from '@ecom/database'
import { getAdminThrottleConfig, getRedisConfig } from '@ecom/config'
import { AuthModule } from './auth/auth.module'
import { SellersModule } from './sellers/sellers.module'
import { DashboardModule } from './dashboard/dashboard.module'
import { AuditLogsModule } from './audit-logs/audit-logs.module'
import { ProductsModule } from './products/products.module'
import { CategoriesModule } from './categories/categories.module'
import { OrdersModule } from './orders/orders.module'
import { RefundsModule } from './refunds/refunds.module'
import { UsersModule } from './users/users.module'
import { PromotionsModule } from './promotions/promotions.module'
import { BannersModule } from './banners/banners.module'
import { NotificationsModule } from './notifications/notifications.module'
import { ReviewsModule } from './reviews/reviews.module'
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor'

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
