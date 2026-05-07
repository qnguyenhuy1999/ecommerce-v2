import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { BulkService } from './bulk.service'
import { BulkJobQueryDto } from './dto/bulk-query.dto'

@Controller('bulk')
@UseGuards(AuthGuard)
export class BulkController {
  constructor(
    private readonly bulkService: BulkService,
    private readonly shopService: ShopService,
  ) {}

  @Get('jobs')
  async listJobs(@CurrentUser() user: SessionData, @Query() query: BulkJobQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.bulkService.listJobs(shopId, query)
  }

  @Get('jobs/:id')
  async getJob(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.bulkService.getJob(shopId, id)
  }

  @Post('import')
  async createImport(
    @CurrentUser() user: SessionData,
    @Body() body: { fileName: string; fileUrl: string; type: 'PRODUCT_IMPORT' | 'INVENTORY_UPDATE' | 'PRICE_UPDATE' },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.bulkService.createImportJob(shopId, body.fileName, body.fileUrl, body.type)
  }

  @Post('export')
  async createExport(
    @CurrentUser() user: SessionData,
    @Body() body: { fileName: string },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.bulkService.createExportJob(shopId, body.fileName)
  }
}
