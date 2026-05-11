import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger';
import {
  Controller, Get, Post, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator';
import { AuditLog } from '../common/decorators/audit-log.decorator';
import { RefundQueryDto, RefundActionDto, RefundResponseDto } from './dto/refund-query.dto';
import { ApiOkResponseData, ApiPaginatedResponse, ApiErrorResponses, ApiAuth } from '@ecom/nestjs-core/openapi';

@ApiTags("Admin/Refunds")
@Controller('refunds')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiErrorResponses()
@ApiAuth()
@ApiExtraModels(RefundResponseDto)
export class RefundsController {
  constructor(
    private readonly refundsService: RefundsService,
  ) {}

  @ApiOperation({ summary: "List all refund requests" })
  @ApiPaginatedResponse(RefundResponseDto)
  @Get()
  @Permissions('REFUND_VIEW')
  async findAll(@Query() query: RefundQueryDto) {
    const result = await this.refundsService.findAll({
      page: query.page,
      limit: query.limit,
      status: query.status,
    });
    return result;
  }

  @ApiOperation({ summary: "Get refund status counts" })
  @ApiOkResponseData(Object)
  @Get('status-counts')
  @Permissions('REFUND_VIEW')
  async statusCounts() {
    const counts = await this.refundsService.getStatusCounts();
    return counts;
  }

  @ApiOperation({ summary: "Get refund request by ID" })
  @ApiOkResponseData(RefundResponseDto)
  @Get(':id')
  @Permissions('REFUND_VIEW')
  async findById(@Param('id') id: string) {
    const refund = await this.refundsService.findById(id);
    return refund;
  }

  @ApiOperation({ summary: "Approve refund request" })
  @ApiOkResponseData(RefundResponseDto)
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

  @ApiOperation({ summary: "Reject refund request" })
  @ApiOkResponseData(RefundResponseDto)
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
