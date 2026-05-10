import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller, Get, Post, Put, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLog } from '../common/decorators/audit-log.decorator';
import { VoucherQueryDto, CreateVoucherDto, UpdateVoucherDto } from './dto/voucher.dto';
import type { PlatformVoucherStatus, PlatformVoucherType } from '@ecom/database';

@ApiTags("Promotions")
@Controller('promotions')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class PromotionsController {
  constructor(
    private readonly promotionsService: PromotionsService,
  ) {}

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get('vouchers')
  @Permissions('MARKETING_MANAGE')
  async findAll(@Query() query: VoucherQueryDto) {
    const result = await this.promotionsService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      status: query.status as PlatformVoucherStatus | undefined,
      search: query.search,
    });
    return result;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get('vouchers/status-counts')
  @Permissions('MARKETING_MANAGE')
  async statusCounts() {
    const counts = await this.promotionsService.getStatusCounts();
    return counts;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get('vouchers/:id')
  @Permissions('MARKETING_MANAGE')
  async findById(@Param('id') id: string) {
    const voucher = await this.promotionsService.findById(id);
    return voucher;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post('vouchers')
  @Permissions('MARKETING_MANAGE')
  @AuditLog('VOUCHER_CREATED', 'PlatformVoucher', { entityIdPath: 'data.id' })
  async create(
    @Body() dto: CreateVoucherDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const voucher = await this.promotionsService.create({
      ...dto,
      type: dto.type as PlatformVoucherType,
      startsAt: new Date(dto.startsAt),
      expiresAt: new Date(dto.expiresAt),
      createdBy: admin.adminId,
    });
    return voucher;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Put('vouchers/:id')
  @Permissions('MARKETING_MANAGE')
  @AuditLog('VOUCHER_UPDATED', 'PlatformVoucher', { entityIdParam: 'id' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVoucherDto,
  ) {
    const voucher = await this.promotionsService.update(id, {
      ...dto,
      status: dto.status as PlatformVoucherStatus | undefined,
    });
    return voucher;
  }
}
