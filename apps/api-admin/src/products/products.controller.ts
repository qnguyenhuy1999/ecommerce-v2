import {
  Controller, Get, Post, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLog } from '../common/decorators/audit-log.decorator';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductModerationDto, BulkModerationDto, ResolveReportDto } from './dto/product-action.dto';
import { type ProductStatus, type ProductReportStatus } from '@ecom/database';
import { AUDIT_ACTIONS } from '@ecom/constants';

@Controller('products')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  @Permissions('PRODUCT_VIEW')
  async findAll(@Query() query: ProductQueryDto) {
    const result = await this.productsService.findAll({
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
      status: query.status as ProductStatus | undefined,
      shopId: query.shopId,
      categoryId: query.categoryId,
    });
    return { success: true, data: result };
  }

  @Get('status-counts')
  @Permissions('PRODUCT_VIEW')
  async statusCounts() {
    const counts = await this.productsService.getStatusCounts();
    return { success: true, data: counts };
  }

  @Get('reports')
  @Permissions('PRODUCT_MODERATE')
  async findReports(@Query() query: ProductQueryDto) {
    const result = await this.productsService.findReports({
      page: query.page,
      pageSize: query.pageSize,
      status: query.status as ProductReportStatus | undefined,
    });
    return { success: true, data: result };
  }

  @Get(':id')
  @Permissions('PRODUCT_VIEW')
  async findById(@Param('id') id: string) {
    const product = await this.productsService.findById(id);
    return { success: true, data: product };
  }

  @Post('bulk/approve')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_BULK_APPROVED', 'Product', {
    metadataExtractor: (_result, body) => ({ count: (body as BulkModerationDto).ids.length }),
  })
  async bulkApprove(
    @Body() dto: BulkModerationDto,
  ) {
    const result = await this.productsService.bulkApprove(dto.ids);
    return { success: true, data: result };
  }

  @Post('bulk/reject')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_BULK_REJECTED', 'Product', {
    metadataExtractor: (_result, body) => ({ count: (body as BulkModerationDto).ids.length }),
  })
  async bulkReject(
    @Body() dto: BulkModerationDto,
  ) {
    const result = await this.productsService.bulkReject(dto.ids);
    return { success: true, data: result };
  }

  @Post(':id/approve')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_APPROVED', 'Product', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ note: (body as { note?: string }).note }),
  })
  async approve(
    @Param('id') id: string,
    @Body() _dto: ProductModerationDto,
  ) {
    const product = await this.productsService.approve(id);
    return { success: true, data: product };
  }

  @Post(':id/reject')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_REJECTED', 'Product', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ note: (body as { note?: string }).note }),
  })
  async reject(
    @Param('id') id: string,
    @Body() _dto: ProductModerationDto,
  ) {
    const product = await this.productsService.reject(id);
    return { success: true, data: product };
  }

  @Post(':id/hide')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_HIDDEN', 'Product', { entityIdParam: 'id' })
  async hide(
    @Param('id') id: string,
  ) {
    const product = await this.productsService.hide(id);
    return { success: true, data: product };
  }

  @Post(':id/unhide')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog(AUDIT_ACTIONS.PRODUCT_UNHIDDEN, 'Product', { entityIdParam: 'id' })
  async unhide(
    @Param('id') id: string,
  ) {
    const product = await this.productsService.unhide(id);
    return { success: true, data: product };
  }

  @Post('reports/:id/resolve')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_REPORT_RESOLVED', 'ProductReport', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ adminNote: (body as ResolveReportDto).adminNote }),
  })
  async resolveReport(
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const report = await this.productsService.resolveReport(id, admin.adminId, dto.adminNote);
    return { success: true, data: report };
  }

  @Post('reports/:id/dismiss')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_REPORT_DISMISSED', 'ProductReport', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ adminNote: (body as ResolveReportDto).adminNote }),
  })
  async dismissReport(
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const report = await this.productsService.dismissReport(id, admin.adminId, dto.adminNote);
    return { success: true, data: report };
  }
}
