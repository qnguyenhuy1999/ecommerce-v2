import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { ReviewService } from './review.service'
import { ReviewQueryDto } from './dto/review-query.dto'

@Controller('reviews')
@UseGuards(AuthGuard)
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  async list(@CurrentUser() user: SessionData, @Query() query: ReviewQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.reviewService.list(shopId, query)
  }

  @Get('analytics')
  async analytics(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.reviewService.getAnalytics(shopId)
  }

  @Get(':id')
  async getById(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.reviewService.getById(shopId, id)
  }

  @Post(':id/reply')
  async reply(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() body: { message: string },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.reviewService.reply(shopId, id, body.message)
  }

  @Post(':id/report')
  async report(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() body: { reason: string; details?: string },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.reviewService.report(shopId, id, body.reason, body.details)
  }
}
