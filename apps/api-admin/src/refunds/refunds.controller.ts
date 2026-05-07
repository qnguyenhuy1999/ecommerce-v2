import {
  Controller, Get, Post, Param, Query, Body, UseGuards, Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { RefundsService } from './refunds.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { RefundQueryDto, RefundActionDto } from './dto/refund-query.dto';
import type { ReturnStatus } from '@ecom/database';

@Controller('refunds')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class RefundsController {
  constructor(
    private readonly refundsService: RefundsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  @Permissions('REFUND_VIEW')
  async findAll(@Query() query: RefundQueryDto) {
    const result = await this.refundsService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      status: query.status as ReturnStatus | undefined,
    });
    return { success: true, data: result };
  }

  @Get('status-counts')
  @Permissions('REFUND_VIEW')
  async statusCounts() {
    const counts = await this.refundsService.getStatusCounts();
    return { success: true, data: counts };
  }

  @Get(':id')
  @Permissions('REFUND_VIEW')
  async findById(@Param('id') id: string) {
    const refund = await this.refundsService.findById(id);
    return { success: true, data: refund };
  }

  @Post(':id/approve')
  @Permissions('REFUND_MANAGE')
  async approve(
    @Param('id') id: string,
    @Body() dto: RefundActionDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const refund = await this.refundsService.approve(id, admin.adminId, dto.note);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'REFUND_APPROVED',
      entityType: 'ReturnRequest', entityId: id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: refund };
  }

  @Post(':id/reject')
  @Permissions('REFUND_MANAGE')
  async reject(
    @Param('id') id: string,
    @Body() dto: RefundActionDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const refund = await this.refundsService.reject(id, admin.adminId, dto.note);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'REFUND_REJECTED',
      entityType: 'ReturnRequest', entityId: id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: refund };
  }
}
