import {
  Controller, Get, Post, Param, Query, Body, UseGuards, Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ProductsService } from './products.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductModerationDto, BulkModerationDto, ResolveReportDto } from './dto/product-action.dto';
import type { ProductStatus, ProductReportStatus } from '@ecom/database';

@Controller('products')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  @Permissions('PRODUCT_VIEW')
  async findAll(@Query() query: ProductQueryDto) {
    const result = await this.productsService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
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
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
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
  async bulkApprove(
    @Body() dto: BulkModerationDto,
  ) {
    const result = await this.productsService.bulkApprove(dto.ids);
    return { success: true, data: result };
  }

  @Post('bulk/reject')
  @Permissions('PRODUCT_MODERATE')
  async bulkReject(
    @Body() dto: BulkModerationDto,
  ) {
    const result = await this.productsService.bulkReject(dto.ids);
    return { success: true, data: result };
  }

  @Post(':id/approve')
  @Permissions('PRODUCT_MODERATE')
  async approve(
    @Param('id') id: string,
    @Body() dto: ProductModerationDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const product = await this.productsService.approve(id);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'PRODUCT_APPROVED',
      entityType: 'Product', entityId: id,
      metadata: { note: dto.note }, ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: product };
  }

  @Post(':id/reject')
  @Permissions('PRODUCT_MODERATE')
  async reject(
    @Param('id') id: string,
    @Body() dto: ProductModerationDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const product = await this.productsService.reject(id);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'PRODUCT_REJECTED',
      entityType: 'Product', entityId: id,
      metadata: { note: dto.note }, ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: product };
  }

  @Post(':id/hide')
  @Permissions('PRODUCT_MODERATE')
  async hide(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const product = await this.productsService.hide(id);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'PRODUCT_HIDDEN',
      entityType: 'Product', entityId: id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: product };
  }

  @Post(':id/unhide')
  @Permissions('PRODUCT_MODERATE')
  async unhide(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const product = await this.productsService.unhide(id);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'PRODUCT_APPROVED',
      entityType: 'Product', entityId: id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: product };
  }

  @Post('reports/:id/resolve')
  @Permissions('PRODUCT_MODERATE')
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
  async dismissReport(
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const report = await this.productsService.dismissReport(id, admin.adminId, dto.adminNote);
    return { success: true, data: report };
  }
}
