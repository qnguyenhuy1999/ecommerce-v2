import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { RedisModule } from '@ecom/redis'
import { EmailModule } from '@ecom/email'
import { AuthModule } from './auth/auth.module'
import { ShopModule } from './shop/shop.module'
import { ProductModule } from './product/product.module'
import { OrderModule } from './order/order.module'
import { InventoryModule } from './inventory/inventory.module'
import { ShippingModule } from './shipping/shipping.module'
import { NotificationModule } from './notification/notification.module'

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
    AuthModule,
    ShopModule,
    ProductModule,
    OrderModule,
    InventoryModule,
    ShippingModule,
    NotificationModule,
  ],
})
export class AppModule {}
