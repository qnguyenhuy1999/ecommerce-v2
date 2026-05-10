import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SellersService } from './sellers.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import {
  CurrentAdmin,
  type AdminSessionData,
} from '../auth/decorators/current-admin.decorator';
import { AuditLog } from '../common/decorators/audit-log.decorator';
import { SellerQueryDto } from './dto/seller-query.dto';
import { SellerActionDto } from './dto/seller-action.dto';
import type { SellerStatus } from '@ecom/database';

@ApiTags("Sellers")
@Controller('sellers')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class SellersController {
  constructor(
    private readonly sellersService: SellersService,
  ) {}

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get()
  @Permissions('SELLER_VIEW')
  async findAll(@Query() query: SellerQueryDto) {
    const result = await this.sellersService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      search: query.search,
      status: query.status as SellerStatus | undefined,
    });
    return result;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get('status-counts')
  @Permissions('SELLER_VIEW')
  async statusCounts() {
    const counts = await this.sellersService.getStatusCounts();
    return counts;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Get(':id')
  @Permissions('SELLER_VIEW')
  async findById(@Param('id') id: string) {
    const seller = await this.sellersService.findById(id);
    return seller;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post(':id/approve')
  @Permissions('SELLER_APPROVE')
  @AuditLog('SELLER_APPROVED', 'Seller', { entityIdParam: 'id' })
  async approve(
    @Param('id') id: string,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const seller = await this.sellersService.approve(id, admin.adminId);
    return seller;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post(':id/reject')
  @Permissions('SELLER_APPROVE')
  @AuditLog('SELLER_REJECTED', 'Seller', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ reason: (body as SellerActionDto).reason }),
  })
  async reject(
    @Param('id') id: string,
    @Body() dto: SellerActionDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const seller = await this.sellersService.reject(
      id,
      admin.adminId,
      dto.reason,
    );
    return seller;
  }

  @ApiOperation({ summary: "" })
  @ApiResponse({ status: 200 })
  @Post(':id/suspend')
  @Permissions('SELLER_SUSPEND')
  @AuditLog('SELLER_SUSPENDED', 'Seller', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ reason: (body as SellerActionDto).reason }),
  })
  async suspend(
    @Param('id') id: string,
    @Body() dto: SellerActionDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const seller = await this.sellersService.suspend(
      id,
      admin.adminId,
      dto.reason,
    );
    return seller;
  }
}
