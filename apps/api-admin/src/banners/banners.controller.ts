import {
  Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { BannersService } from './banners.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { BannerQueryDto, CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
import type { BannerPosition, BannerStatus } from '@ecom/database';

@Controller('banners')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Get()
  @Permissions('BANNER_MANAGE')
  async findAll(@Query() query: BannerQueryDto) {
    const result = await this.bannersService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      position: query.position as BannerPosition | undefined,
      status: query.status as BannerStatus | undefined,
    });
    return { success: true, data: result };
  }

  @Get(':id')
  @Permissions('BANNER_MANAGE')
  async findById(@Param('id') id: string) {
    const banner = await this.bannersService.findById(id);
    return { success: true, data: banner };
  }

  @Post()
  @Permissions('BANNER_MANAGE')
  async create(
    @Body() dto: CreateBannerDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const banner = await this.bannersService.create({
      ...dto,
      position: dto.position as BannerPosition,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      createdBy: admin.adminId,
    });
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'BANNER_PUBLISHED',
      entityType: 'Banner', entityId: banner.id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: banner };
  }

  @Put(':id')
  @Permissions('BANNER_MANAGE')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBannerDto,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.startsAt) data.startsAt = new Date(dto.startsAt);
    if (dto.endsAt) data.endsAt = new Date(dto.endsAt);
    const banner = await this.bannersService.update(id, data);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'BANNER_PUBLISHED',
      entityType: 'Banner', entityId: id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true, data: banner };
  }

  @Delete(':id')
  @Permissions('BANNER_MANAGE')
  async delete(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminSessionData,
    @Req() req: Request,
  ) {
    await this.bannersService.delete(id);
    await this.auditLogService.log({
      adminId: admin.adminId, action: 'BANNER_UNPUBLISHED',
      entityType: 'Banner', entityId: id,
      ipAddress: req.ip, userAgent: req.headers['user-agent'],
    });
    return { success: true };
  }
}
