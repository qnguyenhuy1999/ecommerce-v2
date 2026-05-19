import { type ProductReportStatus } from '@ecom/contracts/enums'
import {
  ApiAuth,
  ApiErrorResponses,
  ApiOkResponseData,
  ApiPaginatedResponse,
} from '@ecom/nestjs-core/openapi'
import { AUDIT_ACTIONS } from '@ecom/shared/constants'
import { withDefined } from '@ecom/shared/utils'
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { AuditLog } from '../common/decorators/audit-log.decorator'
import type {
  BulkModerationDto,
  ProductModerationDto,
  ResolveReportDto,
} from './dto/product-action.dto'
import type { ProductQueryDto } from './dto/product-query.dto'
import { ProductResponseDto } from './dto/product-query.dto'
import type { ProductsService } from './products.service'

@ApiTags('Admin/Products')
@Controller('products')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiAuth()
@ApiErrorResponses()
@ApiExtraModels(ProductResponseDto)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'List all products' })
  @ApiPaginatedResponse(ProductResponseDto)
  @Get()
  @Permissions('PRODUCT_VIEW')
  async findAll(@Query() query: ProductQueryDto) {
    const result = await this.productsService.findAll({
      ...withDefined({
        page: query.page,
        limit: query.limit,
        search: query.search,
        status: query.status,
        shopId: query.shopId,
        categoryId: query.categoryId,
      }),
    })
    return result
  }

  @ApiOperation({ summary: 'Get product status counts' })
  @ApiOkResponseData(Object)
  @Get('status-counts')
  @Permissions('PRODUCT_VIEW')
  async statusCounts() {
    const counts = await this.productsService.getStatusCounts()
    return counts
  }

  @ApiOperation({ summary: 'List product reports' })
  @ApiPaginatedResponse(Object)
  @Get('reports')
  @Permissions('PRODUCT_MODERATE')
  async findReports(@Query() query: ProductQueryDto) {
    const result = await this.productsService.findReports({
      ...withDefined({ page: query.page, limit: query.limit }),
      ...(query.status !== undefined ? { status: query.status as ProductReportStatus } : {}),
    })
    return result
  }

  @ApiOperation({ summary: 'Get product by ID' })
  @ApiOkResponseData(ProductResponseDto)
  @Get(':id')
  @Permissions('PRODUCT_VIEW')
  async findById(@Param('id') id: string) {
    const product = await this.productsService.findById(id)
    return product
  }

  @ApiOperation({ summary: 'Bulk approve products' })
  @ApiOkResponseData(Object)
  @Post('bulk/approve')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_BULK_APPROVED', 'Product', {
    metadataExtractor: (_result, body) => ({ count: (body as BulkModerationDto).ids.length }),
  })
  async bulkApprove(@Body() dto: BulkModerationDto) {
    const result = await this.productsService.bulkApprove(dto.ids)
    return result
  }

  @ApiOperation({ summary: 'Bulk reject products' })
  @ApiOkResponseData(Object)
  @Post('bulk/reject')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_BULK_REJECTED', 'Product', {
    metadataExtractor: (_result, body) => ({ count: (body as BulkModerationDto).ids.length }),
  })
  async bulkReject(@Body() dto: BulkModerationDto) {
    const result = await this.productsService.bulkReject(dto.ids)
    return result
  }

  @ApiOperation({ summary: 'Approve product' })
  @ApiOkResponseData(ProductResponseDto)
  @Post(':id/approve')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_APPROVED', 'Product', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ note: (body as { note?: string }).note }),
  })
  async approve(@Param('id') id: string, @Body() _dto: ProductModerationDto) {
    const product = await this.productsService.approve(id)
    return product
  }

  @ApiOperation({ summary: 'Reject product' })
  @ApiOkResponseData(ProductResponseDto)
  @Post(':id/reject')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_REJECTED', 'Product', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ note: (body as { note?: string }).note }),
  })
  async reject(@Param('id') id: string, @Body() _dto: ProductModerationDto) {
    const product = await this.productsService.reject(id)
    return product
  }

  @ApiOperation({ summary: 'Hide product' })
  @ApiOkResponseData(ProductResponseDto)
  @Post(':id/hide')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_HIDDEN', 'Product', { entityIdParam: 'id' })
  async hide(@Param('id') id: string) {
    const product = await this.productsService.hide(id)
    return product
  }

  @ApiOperation({ summary: 'Unhide product' })
  @ApiOkResponseData(ProductResponseDto)
  @Post(':id/unhide')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog(AUDIT_ACTIONS.PRODUCT_UNHIDDEN, 'Product', { entityIdParam: 'id' })
  async unhide(@Param('id') id: string) {
    const product = await this.productsService.unhide(id)
    return product
  }

  @ApiOperation({ summary: 'Resolve product report' })
  @ApiOkResponseData(Object)
  @Post('reports/:id/resolve')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_REPORT_RESOLVED', 'ProductReport', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ adminNote: (body as ResolveReportDto).adminNote }),
  })
  async resolveReport(
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const report = await this.productsService.resolveReport(id, admin.adminId, dto.adminNote)
    return report
  }

  @ApiOperation({ summary: 'Dismiss product report' })
  @ApiOkResponseData(Object)
  @Post('reports/:id/dismiss')
  @Permissions('PRODUCT_MODERATE')
  @AuditLog('PRODUCT_REPORT_DISMISSED', 'ProductReport', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ adminNote: (body as ResolveReportDto).adminNote }),
  })
  async dismissReport(
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
    @CurrentAdmin() admin: AdminSessionData,
  ) {
    const report = await this.productsService.dismissReport(id, admin.adminId, dto.adminNote)
    return report
  }
}
