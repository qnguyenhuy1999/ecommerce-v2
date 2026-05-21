import type { PrismaService} from '@ecom/database';
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { Injectable, NotFoundException } from '@nestjs/common'
import type { ConversationQueryDto, MessageQueryDto } from './dto/chat-query.dto'

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}
  async listConversations(shopId: string, query: ConversationQueryDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT, search } = query

    const where: Prisma.ConversationWhereInput = {
      shopId,
      ...(search ? { lastMessageText: { contains: search, mode: 'insensitive' } } : {}),
    }

    const { items, total } = await offsetPaginate(this.prisma.conversation, {
      page,
      limit,
      where,
      orderBy: { lastMessageAt: { sort: 'desc', nulls: 'last' } },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async getConversation(shopId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, shopId },
    })

    if (!conversation) {
      throw new NotFoundException('Conversation not found')
    }

    return conversation
  }

  async getMessages(shopId: string, conversationId: string, query: MessageQueryDto) {
    const { page = 1, limit = 50 } = query

    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, shopId },
    })

    if (!conversation) {
      throw new NotFoundException('Conversation not found')
    }

    const { items, total } = await offsetPaginate(this.prisma.chatMessage, {
      page,
      limit,
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items.slice().reverse(), page, limit, total)
  }

  async sendMessage(
    shopId: string,
    conversationId: string,
    senderId: string,
    content: string,
    type: 'TEXT' | 'IMAGE' | 'PRODUCT' = 'TEXT',
    metadata?: Record<string, unknown>,
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, shopId },
    })

    if (!conversation) {
      throw new NotFoundException('Conversation not found')
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const message = await tx.chatMessage.create({
        data: {
          conversationId,
          senderId,
          type,
          content,
          metadata: metadata as Prisma.InputJsonValue,
          isReadBySeller: true,
        },
      })

      await tx.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: new Date(),
          lastMessageText: content.substring(0, 200),
          buyerUnread: { increment: 1 },
        },
      })

      return message
    })
  }

  async markAsRead(shopId: string, sellerUserId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, shopId },
    })

    if (!conversation) {
      throw new NotFoundException('Conversation not found')
    }

    await this.prisma.$transaction([
      this.prisma.chatMessage.updateMany({
        where: { conversationId, isReadBySeller: false, senderId: { not: sellerUserId } },
        data: { isReadBySeller: true },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { sellerUnread: 0 },
      }),
    ])
  }

  async getUnreadCount(shopId: string) {
    const result = await this.prisma.conversation.aggregate({
      where: { shopId },
      _sum: { sellerUnread: true },
    })

    return { unreadCount: result._sum.sellerUnread ?? 0 }
  }
}
