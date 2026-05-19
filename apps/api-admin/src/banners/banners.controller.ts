import {
  ApiAuth,
  ApiErrorResponses,
  ApiOkResponseData,
  ApiPaginatedResponse,
} from '@ecom/nestjs-core/openapi'
import { AUDIT_ACTIONS } from '@ecom/shared/constants'
import { withDefined } from '@ecom/shared/utils'
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { AuditLog } from '../common/decorators/audit-log.decorator'
import type { BannersService } from './banners.service'
import type { BannerQueryDto, CreateBannerDto, UpdateBannerDto } from './dto/banner.dto'
import { BannerResponseDto } from './dto/banner.dto'

@ApiTags('Admin/Banners')
@Controller('banners')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiErrorResponses()
@ApiAuth()
@ApiExtraModels(BannerResponseDto)
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @ApiOperation({ summary: 'List all banners' })
  @ApiPaginatedResponse(BannerResponseDto)
  @Get()
  @Permissions('BANNER_MANAGE')
  async findAll(@Query() query: BannerQueryDto) {
    const result = await this.bannersService.findAll({ ...query })
    return result
  }

  @ApiOperation({ summary: 'Get banner by ID' })
  @ApiOkResponseData(BannerResponseDto)
  @Get(':id')
  @Permissions('BANNER_MANAGE')
  async findById(@Param('id') id: string) {
    const banner = await this.bannersService.findById(id)
    return banner
  }

  @ApiOperation({ summary: 'Create new banner' })
  @ApiOkResponseData(BannerResponseDto)
  @Post()
  @Permissions('BANNER_MANAGE')
  @AuditLog(AUDIT_ACTIONS.BANNER_CREATED, 'Banner', { entityIdPath: 'data.id' })
  async create(@Body() dto: CreateBannerDto, @CurrentAdmin() admin: AdminSessionData) {
    const banner = await this.bannersService.create({
      title: dto.title,
      position: dto.position,
      imageUrl: dto.imageUrl,
      createdBy: admin.adminId,
      ...withDefined({
        mobileImageUrl: dto.mobileImageUrl,
        linkUrl: dto.linkUrl,
        sortOrder: dto.sortOrder,
      }),
      ...(dto.startsAt !== undefined ? { startsAt: new Date(dto.startsAt) } : {}),
      ...(dto.endsAt !== undefined ? { endsAt: new Date(dto.endsAt) } : {}),
    })
    return banner
  }

  @ApiOperation({ summary: 'Update banner' })
  @ApiOkResponseData(BannerResponseDto)
  @Put(':id')
  @Permissions('BANNER_MANAGE')
  @AuditLog(AUDIT_ACTIONS.BANNER_UPDATED, 'Banner', { entityIdParam: 'id' })
  async update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    const banner = await this.bannersService.update(id, {
      ...dto,
    })
    return banner
  }

  @ApiOperation({ summary: 'Delete banner' })
  @ApiOkResponseData(Object)
  @Delete(':id')
  @Permissions('BANNER_MANAGE')
  @AuditLog('BANNER_UNPUBLISHED', 'Banner', { entityIdParam: 'id' })
  async delete(@Param('id') id: string) {
    await this.bannersService.delete(id)
    return { success: true }
  }
}
