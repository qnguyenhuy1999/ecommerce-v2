import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { EmitEventDto } from './dto/event-streaming.dto'
import { offsetPaginate, buildOffsetResponse, OffsetPaginationDto } from '@ecom/pagination'
import { randomUUID } from 'crypto'

@Injectable()
export class EventStreamingService {
  constructor(private readonly prisma: PrismaService) {}
  async emitEvent(dto: EmitEventDto) {
    return this.prisma.platformEvent.create({
      data: {
        eventType: dto.eventType,
        source: dto.source,
        payload: dto.payload ?? {},
        metadata: dto.metadata ?? {},
        idempotencyKey: randomUUID(),
      },
    })
  }

  async listEvents(query: OffsetPaginationDto & { eventType?: string; source?: string }) {
    const { page = 1, pageSize = 20 } = query

    const where: Prisma.PlatformEventWhereInput = {
      ...(query.eventType && { eventType: query.eventType }),
      ...(query.source && { source: query.source }),
    }

    const { items, total } = await offsetPaginate(this.prisma.platformEvent, {
      page,
      pageSize,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async getEventById(id: string) {
    const event = await this.prisma.platformEvent.findUnique({ where: { id } })
    if (!event) throw new NotFoundException('Event not found')
    return event
  }

  async replayEvent(id: string) {
    const event = await this.prisma.platformEvent.findUnique({ where: { id } })
    if (!event) throw new NotFoundException('Event not found')

    return this.prisma.platformEvent.create({
      data: {
        eventType: event.eventType,
        source: event.source,
        payload: event.payload ?? {},
        metadata: {
          ...((event.metadata as Record<string, unknown>) ?? {}),
          replayedFrom: event.id,
        },
        idempotencyKey: randomUUID(),
      },
    })
  }

  async getEventStats() {
    const totalEvents = await this.prisma.platformEvent.count()

    const recentEvents = await this.prisma.platformEvent.count({
      where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    })

    const failedEvents = await this.prisma.platformEvent.count({
      where: { status: 'FAILED' },
    })

    return { totalEvents, recentEvents, failedEvents }
  }

  async markEventProcessed(id: string) {
    return this.prisma.platformEvent.update({
      where: { id },
      data: { status: 'PROCESSED', processedAt: new Date() },
    })
  }

  async markEventFailed(id: string, error: string) {
    const event = await this.prisma.platformEvent.findUnique({ where: { id } })
    if (!event) throw new NotFoundException('Event not found')

    return this.prisma.platformEvent.update({
      where: { id },
      data: {
        status: 'FAILED',
        retryCount: { increment: 1 },
        metadata: { ...((event.metadata as Record<string, unknown>) ?? {}), lastError: error },
      },
    })
  }
}
