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
} from '@ecom/nestjs-openapi'
import { ShopService } from '../shop/shop.service'
import { WarehouseService } from './warehouse.service'
import { WarehouseQueryDto, StockQueryDto, TransferQueryDto } from './dto/warehouse-query.dto'
import { CreateWarehouseDto } from './dto/create-warehouse.dto'

@ApiTags('Seller/Warehouse')
@ApiAuth()
@ApiErrorResponses()
@Controller('warehouses')
@UseGuards(AuthGuard)
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  @ApiPaginatedResponse(Object)
  async list(@CurrentUser() user: SessionData, @Query() query: WarehouseQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.warehouseService.listWarehouses(shopId, query)
  }

  @Post()
  @ApiCreatedResponseData(Object)
  async create(@CurrentUser() user: SessionData, @Body() dto: CreateWarehouseDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.warehouseService.createWarehouse(shopId, dto)
  }

  @Get('alerts')
  @ApiOkResponseData(Object)
  async lowStockAlerts(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.warehouseService.getLowStockAlerts(shopId)
  }

  @Get('transfers')
  @ApiPaginatedResponse(Object)
  async listTransfers(@CurrentUser() user: SessionData, @Query() query: TransferQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.warehouseService.listTransfers(shopId, query)
  }

  @Post('transfers')
  @ApiCreatedResponseData(Object)
  async createTransfer(
    @CurrentUser() user: SessionData,
    @Body() body: { fromWarehouseId: string; toWarehouseId: string; items: { variantId: string; quantity: number }[]; note?: string },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.warehouseService.createTransfer(shopId, body.fromWarehouseId, body.toWarehouseId, body.items, body.note)
  }

  @Post('transfers/:id/complete')
  @ApiOkResponseData(Object)
  async completeTransfer(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.warehouseService.completeTransfer(shopId, id)
  }

  @Get(':id')
  @ApiOkResponseData(Object)
  async getById(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.warehouseService.getWarehouse(shopId, id)
  }

  @Get(':id/stock')
  @ApiPaginatedResponse(Object)
  async getStock(@CurrentUser() user: SessionData, @Param('id') id: string, @Query() query: StockQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.warehouseService.getWarehouseStock(shopId, id, query)
  }

  @Put(':id/stock')
  @ApiOkResponseData(Object)
  async updateStock(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() body: { variantId: string; stock: number; safetyStock?: number },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.warehouseService.updateStock(shopId, id, body.variantId, body.stock, body.safetyStock)
  }
}
