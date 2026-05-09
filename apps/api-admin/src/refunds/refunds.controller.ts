import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller, Get, Post, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLog } from '../common/decorators/audit-log.decorator';
import { RefundQueryDto, RefundActionDto } from './dto/refund-query.dto';
import type { ReturnStatus } from '@ecom/database';

@ApiTags("Refunds")
@Controller('refunds')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class RefundsController {
  constructor(
    private readonly refundsService: RefundsService,
  ) {}

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get()
  @Permissions('REFUND_VIEW')
  async findAll(@Query() query: RefundQueryDto) {
    const result = await this.refundsService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      status: query.status as ReturnStatus | undefined,
    });
    return result;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get('status-counts')
  @Permissions('REFUND_VIEW')
  async statusCounts() {
    const counts = await this.refundsService.getStatusCounts();
    return counts;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get(':id')
  @Permissions('REFUND_VIEW')
  async findById(@Param('id') id: string) {
    const refund = await this.refundsService.findById(id);
    return refund;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post(':id/approve')
  @Permissions('REFUND_MANAGE')
  @AuditLog('REFUND_APPROVED', 'ReturnRequest', { entityIdParam: 'id' })
  async approve(
    @Param('id') id: string,
    @Body() dto: RefundActionDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const refund = await this.refundsService.approve(id, admin.adminId, dto.note);
    return refund;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post(':id/reject')
  @Permissions('REFUND_MANAGE')
  @AuditLog('REFUND_REJECTED', 'ReturnRequest', { entityIdParam: 'id' })
  async reject(
    @Param('id') id: string,
    @Body() dto: RefundActionDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const refund = await this.refundsService.reject(id, admin.adminId, dto.note);
    return refund;
  }
}
