import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { FlashSaleService } from './flash-sale.service'
import { ApplyFlashSaleSlotDto } from './dto/apply-flash-sale-slot.dto'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@Controller('flash-sales')
@UseGuards(AuthGuard)
export class FlashSaleController {
  constructor(
    private readonly flashSaleService: FlashSaleService,
    private readonly shopService: ShopService,
  ) {}

  @Get('campaigns')
  async listCampaigns(@Query() query: OffsetPaginationDto) {
    return this.flashSaleService.listCampaigns(query)
  }

  @Get('campaigns/:id')
  async getCampaign(@Param('id') id: string) {
    return this.flashSaleService.getCampaignById(id)
  }

  @Post('slots/apply')
  async applySlot(@CurrentUser() user: SessionData, @Body() dto: ApplyFlashSaleSlotDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.flashSaleService.applySlot(shopId, dto)
  }

  @Get('slots')
  async listMySlots(@CurrentUser() user: SessionData, @Query() query: OffsetPaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.flashSaleService.listSellerSlots(shopId, query)
  }
}
