import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import {
  ApiOkResponseData,
  ApiCreatedResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'
import type { ShopService } from '../shop/shop.service'
import type { FlashSaleService } from './flash-sale.service'
import type { ApplyFlashSaleSlotDto } from './dto/apply-flash-sale-slot.dto'
import type { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@ApiTags('Seller/FlashSales')
@ApiAuth()
@ApiErrorResponses()
@Controller('flash-sales')
@UseGuards(AuthGuard)
export class FlashSaleController {
  constructor(
    private readonly flashSaleService: FlashSaleService,
    private readonly shopService: ShopService,
  ) {}

  @Get('campaigns')
  @ApiPaginatedResponse(Object)
  async listCampaigns(@Query() query: OffsetPaginationDto) {
    return this.flashSaleService.listCampaigns(query)
  }

  @Get('campaigns/:id')
  @ApiOkResponseData(Object)
  async getCampaign(@Param('id') id: string) {
    return this.flashSaleService.getCampaignById(id)
  }

  @Post('slots/apply')
  @ApiCreatedResponseData(Object)
  async applySlot(@CurrentUser() user: SessionData, @Body() dto: ApplyFlashSaleSlotDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.flashSaleService.applySlot(shopId, dto)
  }

  @Get('slots')
  @ApiPaginatedResponse(Object)
  async listMySlots(@CurrentUser() user: SessionData, @Query() query: OffsetPaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.flashSaleService.listSellerSlots(shopId, query)
  }
}
