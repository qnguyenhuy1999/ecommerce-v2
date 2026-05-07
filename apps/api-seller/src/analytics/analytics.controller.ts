import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { AnalyticsService } from './analytics.service'

@Controller('analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly shopService: ShopService,
  ) {}

  @Get('dashboard')
  async dashboard(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.analyticsService.getDashboardSummary(shopId)
  }

  @Get('revenue')
  async revenue(
    @CurrentUser() user: SessionData,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()
    return this.analyticsService.getRevenueAnalytics(shopId, start, end)
  }

  @Get('orders')
  async orders(
    @CurrentUser() user: SessionData,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()
    return this.analyticsService.getOrderAnalytics(shopId, start, end)
  }

  @Get('products')
  async products(
    @CurrentUser() user: SessionData,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()
    return this.analyticsService.getProductPerformance(shopId, start, end)
  }

  @Get('conversion')
  async conversion(
    @CurrentUser() user: SessionData,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()
    return this.analyticsService.getConversionMetrics(shopId, start, end)
  }
}
