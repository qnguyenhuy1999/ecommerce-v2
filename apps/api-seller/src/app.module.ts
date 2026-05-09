import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { RedisModule } from '@ecom/redis'
import { EmailModule } from '@ecom/email'
import { DatabaseModule } from '@ecom/database'
import { AuthModule } from './auth/auth.module'
import { ShopModule } from './shop/shop.module'
import { ProductModule } from './product/product.module'
import { OrderModule } from './order/order.module'
import { InventoryModule } from './inventory/inventory.module'
import { ShippingModule } from './shipping/shipping.module'
import { NotificationModule } from './notification/notification.module'
import { CouponModule } from './coupon/coupon.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { BulkModule } from './bulk/bulk.module'
import { ReviewModule } from './review/review.module'
import { ChatModule } from './chat/chat.module'
import { ReturnModule } from './return/return.module'
import { ApprovalModule } from './approval/approval.module'
import { WarehouseModule } from './warehouse/warehouse.module'
import { MetricsModule } from './metrics/metrics.module'
import { SearchModule } from './search/search.module'
import { QueueModule } from './queue/queue.module'
import { FlashSaleModule } from './flash-sale/flash-sale.module'
import { AdsModule } from './ads/ads.module'
import { AffiliateModule } from './affiliate/affiliate.module'
import { SubscriptionModule } from './subscription/subscription.module'
import { LivestreamModule } from './livestream/livestream.module'
import { AiToolsModule } from './ai-tools/ai-tools.module'
import { RecommendationModule } from './recommendation/recommendation.module'
import { LoyaltyModule } from './loyalty/loyalty.module'
import { WalletModule } from './wallet/wallet.module'
import { AdvancedSearchModule } from './advanced-search/advanced-search.module'
import { AutomationModule } from './automation/automation.module'
import { I18nModule } from './i18n/i18n.module'
import { EventStreamingModule } from './event-streaming/event-streaming.module'
import { GrowthModule } from './growth/growth.module'

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
    ShopModule,
    ProductModule,
    OrderModule,
    InventoryModule,
    ShippingModule,
    NotificationModule,
    CouponModule,
    AnalyticsModule,
    BulkModule,
    ReviewModule,
    ChatModule,
    ReturnModule,
    ApprovalModule,
    WarehouseModule,
    MetricsModule,
    SearchModule,
    QueueModule,
    FlashSaleModule,
    AdsModule,
    AffiliateModule,
    SubscriptionModule,
    LivestreamModule,
    AiToolsModule,
    RecommendationModule,
    LoyaltyModule,
    WalletModule,
    AdvancedSearchModule,
    AutomationModule,
    I18nModule,
    EventStreamingModule,
    GrowthModule,
  ],
})
export class AppModule {}
