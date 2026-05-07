import {
  Controller, Get, Post, Param, Query, Body, UseGuards, Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { OrdersService } from './orders.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { OrderQueryDto, OrderActionDto } from './dto/order-query.dto';
import type { OrderStatus } from '@ecom/database';

@Controller('orders')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  @Permissions('ORDER_VIEW')
  async findAll(@Query() query: OrderQueryDto) {
    const result = await this.ordersService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      search: query.search,
      status: query.status as OrderStatus | undefined,
      buyerId: query.buyerId,
    });
    return { success: true, data: result };
  }

  @Get('status-counts')
  @Permissions('ORDER_VIEW')
  async statusCounts() {
    const counts = await this.ordersService.getStatusCounts();
    return { success: true, data: counts };
  }

  @Get(':id')
  @Permissions('ORDER_VIEW')
  async findById(@Param('id') id: string) {
    const order = await this.ordersService.findById(id);
    return { success: true, data: order };
  }

  @Post(':id/force-cancel')
  @Permissions('ORDER_MANAGE')
  async forceCancel(
    @Param('id') id: string,
    @Body() dto: OrderActionDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const order = await this.ordersService.forceCancel(id);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'ORDER_FORCE_CANCELLED',
      entityType: 'Order', entityId: id,
      metadata: { reason: dto.reason }, ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: order };
  }

  @Post(':id/force-complete')
  @Permissions('ORDER_MANAGE')
  async forceComplete(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const order = await this.ordersService.forceComplete(id);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'ORDER_FORCE_COMPLETED',
      entityType: 'Order', entityId: id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: order };
  }
}
