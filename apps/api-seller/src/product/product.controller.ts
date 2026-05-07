import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { ProductService } from './product.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductQueryDto } from './dto/product-query.dto'

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  async list(@CurrentUser() user: SessionData, @Query() query: ProductQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.productService.list(shopId, query)
  }

  @Get('categories')
  async categories() {
    return this.productService.listCategories()
  }

  @Get(':id')
  async getById(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.productService.getById(shopId, id)
  }

  @Post()
  async create(@CurrentUser() user: SessionData, @Body() dto: CreateProductDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.productService.create(shopId, dto)
  }

  @Put(':id')
  async update(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.productService.update(shopId, id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    await this.productService.delete(shopId, id)
  }

  @Post('bulk/status')
  async bulkUpdateStatus(
    @CurrentUser() user: SessionData,
    @Body() body: { productIds: string[]; status: string },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.productService.bulkUpdateStatus(shopId, body.productIds, body.status)
  }

  @Post('bulk/delete')
  async bulkDelete(
    @CurrentUser() user: SessionData,
    @Body() body: { productIds: string[] },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.productService.bulkDelete(shopId, body.productIds)
  }
}
