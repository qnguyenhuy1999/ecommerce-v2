import { Controller, Get, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { RecommendationService } from './recommendation.service'

@Controller('recommendations')
@UseGuards(AuthGuard)
export class RecommendationController {
  constructor(
    private readonly recommendationService: RecommendationService,
    private readonly shopService: ShopService,
  ) {}

  @Get('stats')
  async getStats(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.recommendationService.getSellerRecommendationStats(shopId)
  }
}
