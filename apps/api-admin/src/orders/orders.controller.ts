import {
  Controller, Get, Post, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { AuditLog } from '../common/decorators/audit-log.decorator';
import { OrderQueryDto, OrderActionDto } from './dto/order-query.dto';
import type { OrderStatus } from '@ecom/database';

@Controller('orders')
@UseGuards(AdminAuthGuard, PermissionGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Get()
  @Permissions('ORDER_VIEW')
  async findAll(@Query() query: OrderQueryDto) {
    const result = await this.ordersService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
      search: query.search,
      status: query.status as OrderStatus | undefined,
      buyerId: query.buyerId,
    });
    return { success: true, data: result };
  }

  @Get('status-counts')
  @Permissions('ORDER_VIEW')
  async statusCounts() {
    const counts = await this.ordersService.getStatusCounts();
    return { success: true, data: counts };
  }

  @Get(':id')
  @Permissions('ORDER_VIEW')
  async findById(@Param('id') id: string) {
    const order = await this.ordersService.findById(id);
    return { success: true, data: order };
  }

  @Post(':id/force-cancel')
  @Permissions('ORDER_MANAGE')
  @AuditLog('ORDER_FORCE_CANCELLED', 'Order', {
    entityIdParam: 'id',
    metadataExtractor: (_result, body) => ({ reason: (body as { reason?: string }).reason }),
  })
  async forceCancel(
    @Param('id') id: string,
    @Body() _dto: OrderActionDto,
  ) {
    const order = await this.ordersService.forceCancel(id);
    return { success: true, data: order };
  }

  @Post(':id/force-complete')
  @Permissions('ORDER_MANAGE')
  @AuditLog('ORDER_FORCE_COMPLETED', 'Order', { entityIdParam: 'id' })
  async forceComplete(
    @Param('id') id: string,
  ) {
    const order = await this.ordersService.forceComplete(id);
    return { success: true, data: order };
  }
}
