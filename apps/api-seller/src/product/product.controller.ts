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
import { ApiTags } from '@nestjs/swagger'
import { IsEnum, IsArray, IsString } from 'class-validator'
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
import { ShopService } from '../shop/shop.service'
import { ProductService } from './product.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductQueryDto } from './dto/product-query.dto'
import { ProductStatus } from '@ecom/contracts'

class BulkUpdateStatusDto {
  @IsArray()
  @IsString({ each: true })
  productIds!: string[]

  @IsEnum(ProductStatus)
  status!: ProductStatus
}

@ApiTags('Seller/Products')
@ApiAuth()
@ApiErrorResponses()
@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  @ApiPaginatedResponse(Object)
  async list(@CurrentUser() user: SessionData, @Query() query: ProductQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.productService.list(shopId, query)
  }

  @Get('categories')
  @ApiOkResponseData(Object)
  async categories() {
    return this.productService.listCategories()
  }

  @Get(':id')
  @ApiOkResponseData(Object)
  async getById(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.productService.getById(shopId, id)
  }

  @Post()
  @ApiCreatedResponseData(Object)
  async create(@CurrentUser() user: SessionData, @Body() dto: CreateProductDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.productService.create(shopId, dto)
  }

  @Put(':id')
  @ApiOkResponseData(Object)
  async update(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.productService.update(shopId, id, dto)
  }

  @Delete(':id')
  @ApiOkResponseData(Object)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    await this.productService.delete(shopId, id)
  }

  @Post('bulk/status')
  @ApiOkResponseData(Object)
  async bulkUpdateStatus(@CurrentUser() user: SessionData, @Body() body: BulkUpdateStatusDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.productService.bulkUpdateStatus(shopId, body.productIds, body.status)
  }

  @Post('bulk/delete')
  @ApiOkResponseData(Object)
  async bulkDelete(@CurrentUser() user: SessionData, @Body() body: { productIds: string[] }) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.productService.bulkDelete(shopId, body.productIds)
  }
}
