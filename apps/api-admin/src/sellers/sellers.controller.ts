import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { SellersService } from './sellers.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import {
  CurrentAdmin,
  type AdminSessionData,
} from '../auth/decorators/current-admin.decorator';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { SellerQueryDto } from './dto/seller-query.dto';
import { SellerActionDto } from './dto/seller-action.dto';
import type { SellerStatus } from '@ecom/database';

@Controller('sellers')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class SellersController {
  constructor(
    private readonly sellersService: SellersService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  @Permissions('SELLER_VIEW')
  async findAll(@Query() query: SellerQueryDto) {
    const result = await this.sellersService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      search: query.search,
      status: query.status as SellerStatus | undefined,
    });
    return { success: true, data: result };
  }

  @Get('status-counts')
  @Permissions('SELLER_VIEW')
  async statusCounts() {
    const counts = await this.sellersService.getStatusCounts();
    return { success: true, data: counts };
  }

  @Get(':id')
  @Permissions('SELLER_VIEW')
  async findById(@Param('id') id: string) {
    const seller = await this.sellersService.findById(id);
    return { success: true, data: seller };
  }

  @Post(':id/approve')
  @Permissions('SELLER_APPROVE')
  async approve(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const seller = await this.sellersService.approve(id, admin.adminId);

    await this.auditLogService.log({
      adminId: admin.adminId,
      action: 'SELLER_APPROVED',
      entityType: 'Seller',
      entityId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return { success: true, data: seller };
  }

  @Post(':id/reject')
  @Permissions('SELLER_APPROVE')
  async reject(
    @Param('id') id: string,
    @Body() dto: SellerActionDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const seller = await this.sellersService.reject(
      id,
      admin.adminId,
      dto.reason,
    );

    await this.auditLogService.log({
      adminId: admin.adminId,
      action: 'SELLER_REJECTED',
      entityType: 'Seller',
      entityId: id,
      metadata: { reason: dto.reason },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return { success: true, data: seller };
  }

  @Post(':id/suspend')
  @Permissions('SELLER_SUSPEND')
  async suspend(
    @Param('id') id: string,
    @Body() dto: SellerActionDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const seller = await this.sellersService.suspend(
      id,
      admin.adminId,
      dto.reason,
    );

    await this.auditLogService.log({
      adminId: admin.adminId,
      action: 'SELLER_SUSPENDED',
      entityType: 'Seller',
      entityId: id,
      metadata: { reason: dto.reason },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return { success: true, data: seller };
  }
}
