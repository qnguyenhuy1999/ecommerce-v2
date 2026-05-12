import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PlatformEventStatus } from '@ecom/contracts/enums'
import { EmitEventDto } from './dto/event-streaming.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { OffsetPaginationDTO } from '@ecom/shared/pagination/core'
@Injectable()
export class EventStreamingService {
  constructor(private readonly prisma: PrismaService) {}
  async emitEvent(dto: EmitEventDto) {
    return this.prisma.platformEvent.create({
      data: {
        type: dto.eventType,
        source: dto.source,
        payload: (dto.payload ?? {}) as Prisma.InputJsonValue,
        metadata: (dto.metadata ?? {}) as Prisma.InputJsonValue,
      },
    })
  }

  async listEvents(query: OffsetPaginationDTO & { eventType?: string; source?: string }) {
    const { page = 1, limit = 20 } = query

    const where: Prisma.PlatformEventWhereInput = {
      ...(query.eventType && { type: query.eventType }),
      ...(query.source && { source: query.source }),
    }

    const { items, total } = await offsetPaginate(this.prisma.platformEvent, {
      page,
      pageSize: limit,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
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
        type: event.type,
        source: event.source,
        payload: event.payload ?? {},
        metadata: {
          ...((event.metadata as Record<string, unknown>) ?? {}),
          replayedFrom: event.id,
        },
      },
    })
  }

  async getEventStats() {
    const totalEvents = await this.prisma.platformEvent.count()

    const recentEvents = await this.prisma.platformEvent.count({
      where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    })

    const failedEvents = await this.prisma.platformEvent.count({
      where: { status: PlatformEventStatus.FAILED },
    })

    return { totalEvents, recentEvents, failedEvents }
  }

  async markEventProcessed(id: string) {
    return this.prisma.platformEvent.update({
      where: { id },
      data: { status: PlatformEventStatus.DELIVERED, processedAt: new Date() },
    })
  }

  async markEventFailed(id: string, error: string) {
    const event = await this.prisma.platformEvent.findUnique({ where: { id } })
    if (!event) throw new NotFoundException('Event not found')

    return this.prisma.platformEvent.update({
      where: { id },
      data: {
        status: PlatformEventStatus.FAILED,
        metadata: {
          ...((event.metadata as Record<string, unknown>) ?? {}),
          lastError: error,
        },
      },
    })
  }
}
