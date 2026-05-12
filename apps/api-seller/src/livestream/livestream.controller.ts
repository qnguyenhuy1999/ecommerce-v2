import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
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
import type { LivestreamService } from './livestream.service'
import type {
  CreateLivestreamDto,
  AddLivestreamProductDto,
  PinProductDto,
} from './dto/livestream.dto'
import type { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@ApiTags('Seller/Livestream')
@ApiAuth()
@ApiErrorResponses()
@Controller('livestreams')
@UseGuards(AuthGuard)
export class LivestreamController {
  constructor(
    private readonly livestreamService: LivestreamService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  @ApiPaginatedResponse(Object)
  async listSessions(@CurrentUser() user: SessionData, @Query() query: OffsetPaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.listSessions(shopId, query)
  }

  @Get(':id')
  @ApiOkResponseData(Object)
  async getSession(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.getSessionById(shopId, id)
  }

  @Post()
  @ApiCreatedResponseData(Object)
  async createSession(@CurrentUser() user: SessionData, @Body() dto: CreateLivestreamDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.createSession(shopId, dto)
  }

  @Put(':id/start')
  @ApiOkResponseData(Object)
  async startStream(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.startStream(shopId, id)
  }

  @Put(':id/end')
  @ApiOkResponseData(Object)
  async endStream(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.endStream(shopId, id)
  }

  @Post(':id/products')
  @ApiCreatedResponseData(Object)
  async addProduct(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() dto: AddLivestreamProductDto,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.addProduct(shopId, id, dto)
  }

  @Put(':id/products/:productId/pin')
  @ApiOkResponseData(Object)
  async pinProduct(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Param('productId') productId: string,
    @Body() dto: PinProductDto,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.pinProduct(shopId, id, productId, dto.isPinned)
  }
}
