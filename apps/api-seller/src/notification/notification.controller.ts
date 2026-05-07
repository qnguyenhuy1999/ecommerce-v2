import { Controller, Get, Post, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { NotificationService } from './notification.service'
import { NotificationQueryDto } from './dto/notification-query.dto'

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  async list(@CurrentUser() user: SessionData, @Query() query: NotificationQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.notificationService.list(shopId, query)
  }

  @Get('unread-count')
  async unreadCount(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.notificationService.getUnreadCount(shopId)
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    await this.notificationService.markAsRead(shopId, id)
    return { message: 'Marked as read' }
  }

  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.notificationService.markAllAsRead(shopId)
  }
}
