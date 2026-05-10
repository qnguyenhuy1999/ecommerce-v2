import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLog } from '../common/decorators/audit-log.decorator';
import { BannerQueryDto, CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import { type BannerPosition, type BannerStatus } from '@ecom/database';
import { AUDIT_ACTIONS } from '@ecom/shared/constants';

@ApiTags("Banners")
@Controller('banners')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
  ) {}

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get()
  @Permissions('BANNER_MANAGE')
  async findAll(@Query() query: BannerQueryDto) {
    const result = await this.bannersService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      position: query.position as BannerPosition | undefined,
      status: query.status as BannerStatus | undefined,
    });
    return result;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get(':id')
  @Permissions('BANNER_MANAGE')
  async findById(@Param('id') id: string) {
    const banner = await this.bannersService.findById(id);
    return banner;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post()
  @Permissions('BANNER_MANAGE')
  @AuditLog(AUDIT_ACTIONS.BANNER_CREATED, 'Banner', { entityIdPath: 'data.id' })
  async create(
    @Body() dto: CreateBannerDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const banner = await this.bannersService.create({
      ...dto,
      position: dto.position as BannerPosition,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      createdBy: admin.adminId,
    });
    return banner;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Put(':id')
  @Permissions('BANNER_MANAGE')
  @AuditLog(AUDIT_ACTIONS.BANNER_UPDATED, 'Banner', { entityIdParam: 'id' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBannerDto,
  ) {
    const banner = await this.bannersService.update(id, {
      ...dto,
      position: dto.position as BannerPosition | undefined,
      status: dto.status as BannerStatus | undefined,
    });
    return banner;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  @Permissions('BANNER_MANAGE')
  @AuditLog('BANNER_UNPUBLISHED', 'Banner', { entityIdParam: 'id' })
  async delete(
    @Param('id') id: string,
  ) {
    await this.bannersService.delete(id);
    return { success: true };
  }
}
