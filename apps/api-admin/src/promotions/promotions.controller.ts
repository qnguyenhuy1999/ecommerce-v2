import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger'
import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common'
import type { PromotionsService } from './promotions.service'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator'
import { AuditLog } from '../common/decorators/audit-log.decorator'
import type { VoucherQueryDto, CreateVoucherDto, UpdateVoucherDto } from './dto/voucher.dto'
import { VoucherResponseDto } from './dto/voucher.dto'
import {
  ApiOkResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'

@ApiTags('Admin/Promotions')
@Controller('promotions')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiErrorResponses()
@ApiAuth()
@ApiExtraModels(VoucherResponseDto)
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @ApiOperation({ summary: 'List all platform vouchers' })
  @ApiPaginatedResponse(VoucherResponseDto)
  @Get('vouchers')
  @Permissions('MARKETING_MANAGE')
  async findAll(@Query() query: VoucherQueryDto) {
    const result = await this.promotionsService.findAll({ ...query })
    return result
  }

  @ApiOperation({ summary: 'Get voucher status counts' })
  @ApiOkResponseData(Object)
  @Get('vouchers/status-counts')
  @Permissions('MARKETING_MANAGE')
  async statusCounts() {
    const counts = await this.promotionsService.getStatusCounts()
    return counts
  }

  @ApiOperation({ summary: 'Get voucher by ID' })
  @ApiOkResponseData(VoucherResponseDto)
  @Get('vouchers/:id')
  @Permissions('MARKETING_MANAGE')
  async findById(@Param('id') id: string) {
    const voucher = await this.promotionsService.findById(id)
    return voucher
  }

  @ApiOperation({ summary: 'Create new platform voucher' })
  @ApiOkResponseData(VoucherResponseDto)
  @Post('vouchers')
  @Permissions('MARKETING_MANAGE')
  @AuditLog('VOUCHER_CREATED', 'PlatformVoucher', { entityIdPath: 'data.id' })
  async create(@Body() dto: CreateVoucherDto, @CurrentAdmin() admin: AdminSessionData) {
    const voucher = await this.promotionsService.create({
      ...dto,
      startsAt: new Date(dto.startsAt),
      expiresAt: new Date(dto.expiresAt),
      createdBy: admin.adminId,
    })
    return voucher
  }

  @ApiOperation({ summary: 'Update platform voucher' })
  @ApiOkResponseData(VoucherResponseDto)
  @Put('vouchers/:id')
  @Permissions('MARKETING_MANAGE')
  @AuditLog('VOUCHER_UPDATED', 'PlatformVoucher', { entityIdParam: 'id' })
  async update(@Param('id') id: string, @Body() dto: UpdateVoucherDto) {
    const voucher = await this.promotionsService.update(id, {
      ...dto,
    })
    return voucher
  }
}
