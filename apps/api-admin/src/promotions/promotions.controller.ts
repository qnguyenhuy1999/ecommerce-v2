import {
  Controller, Get, Post, Put, Param, Query, Body, UseGuards, Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { PromotionsService } from './promotions.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { VoucherQueryDto, CreateVoucherDto, UpdateVoucherDto } from './dto/voucher.dto';
import type { PlatformVoucherStatus, PlatformVoucherType } from '@ecom/database';

@Controller('promotions')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class PromotionsController {
  constructor(
    private readonly promotionsService: PromotionsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get('vouchers')
  @Permissions('MARKETING_MANAGE')
  async findAll(@Query() query: VoucherQueryDto) {
    const result = await this.promotionsService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      status: query.status as PlatformVoucherStatus | undefined,
      search: query.search,
    });
    return { success: true, data: result };
  }

  @Get('vouchers/status-counts')
  @Permissions('MARKETING_MANAGE')
  async statusCounts() {
    const counts = await this.promotionsService.getStatusCounts();
    return { success: true, data: counts };
  }

  @Get('vouchers/:id')
  @Permissions('MARKETING_MANAGE')
  async findById(@Param('id') id: string) {
    const voucher = await this.promotionsService.findById(id);
    return { success: true, data: voucher };
  }

  @Post('vouchers')
  @Permissions('MARKETING_MANAGE')
  async create(
    @Body() dto: CreateVoucherDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const voucher = await this.promotionsService.create({
      ...dto,
      type: dto.type as PlatformVoucherType,
      startsAt: new Date(dto.startsAt),
      expiresAt: new Date(dto.expiresAt),
      createdBy: admin.adminId,
    });
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'VOUCHER_CREATED',
      entityType: 'PlatformVoucher', entityId: voucher.id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: voucher };
  }

  @Put('vouchers/:id')
  @Permissions('MARKETING_MANAGE')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVoucherDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.startsAt) data.startsAt = new Date(dto.startsAt);
    if (dto.expiresAt) data.expiresAt = new Date(dto.expiresAt);
    const voucher = await this.promotionsService.update(id, data);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'VOUCHER_UPDATED',
      entityType: 'PlatformVoucher', entityId: id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: voucher };
  }
}
