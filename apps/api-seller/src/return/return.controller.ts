import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common'
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
import type { ReturnService } from './return.service'
import type { ReturnQueryDto } from './dto/return-query.dto'

@ApiTags('Seller/Returns')
@ApiAuth()
@ApiErrorResponses()
@Controller('returns')
@UseGuards(AuthGuard)
export class ReturnController {
  constructor(
    private readonly returnService: ReturnService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  @ApiPaginatedResponse(Object)
  async list(@CurrentUser() user: SessionData, @Query() query: ReturnQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.returnService.list(shopId, query)
  }

  @Get('stats')
  @ApiOkResponseData(Object)
  async stats(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.returnService.getStats(shopId)
  }

  @Get(':id')
  @ApiOkResponseData(Object)
  async getById(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.returnService.getById(shopId, id)
  }

  @Put(':id/status')
  @ApiOkResponseData(Object)
  async updateStatus(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() body: { status: string; note?: string },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.returnService.updateStatus(shopId, id, body.status, body.note, user.userId)
  }

  @Post(':id/evidence')
  @ApiCreatedResponseData(Object)
  async addEvidence(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() body: { url: string; description?: string },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.returnService.addEvidence(shopId, id, user.userId, body.url, body.description)
  }
}
