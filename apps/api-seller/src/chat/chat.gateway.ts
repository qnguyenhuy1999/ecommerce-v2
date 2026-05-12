import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  private connectedUsers = new Map<string, string>()

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string
    if (userId) {
      this.connectedUsers.set(client.id, userId)
      client.join(`user:${userId}`)
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id)
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation:${data.conversationId}`)
  }

  @SubscribeMessage('leave_conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation:${data.conversationId}`)
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() _client: Socket,
    @MessageBody()
    data: {
      shopId: string
      conversationId: string
      senderId: string
      content: string
      type?: 'TEXT' | 'IMAGE' | 'PRODUCT'
    },
  ) {
    const message = await this.chatService.sendMessage(
      data.shopId,
      data.conversationId,
      data.senderId,
      data.content,
      data.type,
    )

    this.server.to(`conversation:${data.conversationId}`).emit('new_message', message)
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string },
  ) {
    client.to(`conversation:${data.conversationId}`).emit('user_typing', {
      userId: data.userId,
      conversationId: data.conversationId,
    })
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() _client: Socket,
    @MessageBody() data: { shopId: string; conversationId: string },
  ) {
    await this.chatService.markAsRead(data.shopId, data.conversationId)
    this.server.to(`conversation:${data.conversationId}`).emit('messages_read', {
      conversationId: data.conversationId,
    })
  }
}
