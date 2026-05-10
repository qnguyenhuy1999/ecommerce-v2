import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger';
import {
  Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLog } from '../common/decorators/audit-log.decorator';
import { BannerQueryDto, CreateBannerDto, UpdateBannerDto, BannerResponseDto } from './dto/banner.dto';
import { AUDIT_ACTIONS } from '@ecom/shared/constants';
import { ApiOkResponseData, ApiPaginatedResponse, ApiErrorResponses, ApiAuth } from '@ecom/nestjs-openapi';

@ApiTags("Admin/Banners")
@Controller('banners')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiErrorResponses()
@ApiAuth()
@ApiExtraModels(BannerResponseDto)
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
  ) {}

  @ApiOperation({ summary: "List all banners" })
  @ApiPaginatedResponse(BannerResponseDto)
  @Get()
  @Permissions('BANNER_MANAGE')
  async findAll(@Query() query: BannerQueryDto) {
    const result = await this.bannersService.findAll({
      page: query.page,
      limit: query.limit,
      position: query.position,
      status: query.status,
    });
    return result;
  }

  @ApiOperation({ summary: "Get banner by ID" })
  @ApiOkResponseData(BannerResponseDto)
  @Get(':id')
  @Permissions('BANNER_MANAGE')
  async findById(@Param('id') id: string) {
    const banner = await this.bannersService.findById(id);
    return banner;
  }

  @ApiOperation({ summary: "Create new banner" })
  @ApiOkResponseData(BannerResponseDto)
  @Post()
  @Permissions('BANNER_MANAGE')
  @AuditLog(AUDIT_ACTIONS.BANNER_CREATED, 'Banner', { entityIdPath: 'data.id' })
  async create(
    @Body() dto: CreateBannerDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const banner = await this.bannersService.create({
      ...dto,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      createdBy: admin.adminId,
    });
    return banner;
  }

  @ApiOperation({ summary: "Update banner" })
  @ApiOkResponseData(BannerResponseDto)
  @Put(':id')
  @Permissions('BANNER_MANAGE')
  @AuditLog(AUDIT_ACTIONS.BANNER_UPDATED, 'Banner', { entityIdParam: 'id' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBannerDto,
  ) {
    const banner = await this.bannersService.update(id, {
      ...dto,
    });
    return banner;
  }

  @ApiOperation({ summary: "Delete banner" })
  @ApiOkResponseData(Object)
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
