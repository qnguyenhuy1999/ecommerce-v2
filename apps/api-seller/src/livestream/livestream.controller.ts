import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { LivestreamService } from './livestream.service'
import { CreateLivestreamDto, AddLivestreamProductDto, PinProductDto } from './dto/livestream.dto'
import { PaginationDto } from '../common/dto/pagination.dto'

@Controller('livestreams')
@UseGuards(AuthGuard)
export class LivestreamController {
  constructor(
    private readonly livestreamService: LivestreamService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  async listSessions(@CurrentUser() user: SessionData, @Query() query: PaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.listSessions(shopId, query)
  }

  @Get(':id')
  async getSession(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.getSessionById(shopId, id)
  }

  @Post()
  async createSession(@CurrentUser() user: SessionData, @Body() dto: CreateLivestreamDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.createSession(shopId, dto)
  }

  @Put(':id/start')
  async startStream(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.startStream(shopId, id)
  }

  @Put(':id/end')
  async endStream(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.endStream(shopId, id)
  }

  @Post(':id/products')
  async addProduct(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() dto: AddLivestreamProductDto,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.livestreamService.addProduct(shopId, id, dto)
  }

  @Put(':id/products/:productId/pin')
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
