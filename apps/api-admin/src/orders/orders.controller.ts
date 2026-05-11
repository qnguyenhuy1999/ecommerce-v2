import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger'
import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common'
import type { OrdersService } from './orders.service'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { AuditLog } from '../common/decorators/audit-log.decorator'
import type { OrderQueryDto, OrderActionDto } from './dto/order-query.dto'
import { OrderResponseDto } from './dto/order-query.dto'
import {
  ApiOkResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'

@ApiTags('Admin/Orders')
@Controller('orders')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiAuth()
@ApiErrorResponses()
@ApiExtraModels(OrderResponseDto)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'List all orders' })
  @ApiPaginatedResponse(OrderResponseDto)
  @Get()
  @Permissions('ORDER_VIEW')
  async findAll(@Query() query: OrderQueryDto) {
    const result = await this.ordersService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      status: query.status,
      buyerId: query.buyerId,
    })
    return result
  }

  @ApiOperation({ summary: 'Get order status counts' })
  @ApiOkResponseData(Object)
  @Get('status-counts')
  @Permissions('ORDER_VIEW')
  async statusCounts() {
    const counts = await this.ordersService.getStatusCounts()
    return counts
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @ApiOkResponseData(OrderResponseDto)
  @Get(':id')
  @Permissions('ORDER_VIEW')
  async findById(@Param('id') id: string) {
    const order = await this.ordersService.findById(id)
    return order
  }

  @ApiOperation({ summary: 'Force cancel order' })
  @ApiOkResponseData(OrderResponseDto)
  @Post(':id/force-cancel')
  @Permissions('ORDER_MANAGE')
  @AuditLog('ORDER_FORCE_CANCELLED', 'Order', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ reason: (body as { reason?: string }).reason }),
  })
  async forceCancel(@Param('id') id: string, @Body() _dto: OrderActionDto) {
    const order = await this.ordersService.forceCancel(id)
    return order
  }

  @ApiOperation({ summary: 'Force complete order' })
  @ApiOkResponseData(OrderResponseDto)
  @Post(':id/force-complete')
  @Permissions('ORDER_MANAGE')
  @AuditLog('ORDER_FORCE_COMPLETED', 'Order', { entityIdParam: 'id' })
  async forceComplete(@Param('id') id: string) {
    const order = await this.ordersService.forceComplete(id)
    return order
  }
}
