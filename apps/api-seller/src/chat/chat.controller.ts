import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { ChatService } from './chat.service'
import { ConversationQueryDto, MessageQueryDto } from './dto/chat-query.dto'

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly shopService: ShopService,
  ) {}

  @Get('conversations')
  async listConversations(@CurrentUser() user: SessionData, @Query() query: ConversationQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.chatService.listConversations(shopId, query)
  }

  @Get('unread')
  async unreadCount(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.chatService.getUnreadCount(shopId)
  }

  @Get('conversations/:id')
  async getConversation(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.chatService.getConversation(shopId, id)
  }

  @Get('conversations/:id/messages')
  async getMessages(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Query() query: MessageQueryDto,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.chatService.getMessages(shopId, id, query)
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() body: { content: string; type?: 'TEXT' | 'IMAGE' | 'PRODUCT'; metadata?: Record<string, unknown> },
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.chatService.sendMessage(shopId, id, user.userId, body.content, body.type, body.metadata)
  }

  @Post('conversations/:id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAsRead(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    await this.chatService.markAsRead(shopId, id)
  }
}
