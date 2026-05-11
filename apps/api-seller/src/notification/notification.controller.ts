import { Controller, Get, Post, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import {
  ApiOkResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'
import { ShopService } from '../shop/shop.service'
import { NotificationService } from './notification.service'
import { NotificationQueryDto } from './dto/notification-query.dto'

@ApiTags('Seller/Notifications')
@ApiAuth()
@ApiErrorResponses()
@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  @ApiPaginatedResponse(Object)
  async list(@CurrentUser() user: SessionData, @Query() query: NotificationQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.notificationService.list(shopId, query)
  }

  @Get('unread-count')
  @ApiOkResponseData(Object)
  async unreadCount(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.notificationService.getUnreadCount(shopId)
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(Object)
  async markAsRead(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    await this.notificationService.markAsRead(shopId, id)
    return { message: 'Marked as read' }
  }

  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseData(Object)
  async markAllAsRead(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.notificationService.markAllAsRead(shopId)
  }
}
