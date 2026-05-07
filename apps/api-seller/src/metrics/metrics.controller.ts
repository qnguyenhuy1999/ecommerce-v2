import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { MetricsService } from './metrics.service'

@Controller('metrics')
@UseGuards(AuthGuard)
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  async current(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.metricsService.getCurrentMetrics(shopId)
  }

  @Get('history')
  async history(@CurrentUser() user: SessionData, @Query('days') days?: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.metricsService.getMetricHistory(shopId, days ? parseInt(days, 10) : 30)
  }

  @Post('snapshot')
  async snapshot(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.metricsService.takeSnapshot(shopId)
  }
}
