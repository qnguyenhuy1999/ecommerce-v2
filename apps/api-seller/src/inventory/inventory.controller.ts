import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import {
  ApiOkResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'
import { ShopService } from '../shop/shop.service'
import { InventoryService } from './inventory.service'
import type { InventoryQueryDto } from './dto/inventory-query.dto'
import type { UpdateStockDto, BulkUpdateStockDto } from './dto/update-stock.dto'

@ApiTags('Seller/Inventory')
@ApiAuth()
@ApiErrorResponses()
@Controller('inventory')
@UseGuards(AuthGuard)
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  @ApiPaginatedResponse(Object)
  async list(@CurrentUser() user: SessionData, @Query() query: InventoryQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.inventoryService.list(shopId, query)
  }

  @Get('low-stock')
  @ApiOkResponseData(Object)
  async lowStock(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.inventoryService.getLowStockAlerts(shopId)
  }

  @Get(':variantId/history')
  @ApiPaginatedResponse(Object)
  async history(
    @CurrentUser() user: SessionData,
    @Param('variantId') variantId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.inventoryService.getHistory(
      shopId,
      variantId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    )
  }

  @Post('update')
  @ApiOkResponseData(Object)
  async updateStock(@CurrentUser() user: SessionData, @Body() dto: UpdateStockDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.inventoryService.updateStock(shopId, dto.variantId, dto.quantity, dto.type, dto.note)
  }

  @Post('bulk-update')
  @ApiOkResponseData(Object)
  async bulkUpdate(@CurrentUser() user: SessionData, @Body() dto: BulkUpdateStockDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.inventoryService.bulkUpdateStock(shopId, dto.items)
  }
}
