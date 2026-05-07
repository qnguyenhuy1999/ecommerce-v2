import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { ReturnService } from './return.service'
import { ReturnQueryDto } from './dto/return-query.dto'

@Controller('returns')
@UseGuards(AuthGuard)
export class ReturnController {
  constructor(
    private readonly returnService: ReturnService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  async list(@CurrentUser() user: SessionData, @Query() query: ReturnQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.returnService.list(shopId, query)
  }

  @Get('stats')
  async stats(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.returnService.getStats(shopId)
  }

  @Get(':id')
  async getById(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.returnService.getById(shopId, id)
  }

  @Put(':id/status')
  async updateStatus(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() body: { status: string; note?: string },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.returnService.updateStatus(shopId, id, body.status, body.note, user.userId)
  }

  @Post(':id/evidence')
  async addEvidence(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() body: { url: string; description?: string },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.returnService.addEvidence(shopId, id, user.userId, body.url, body.description)
  }
}
