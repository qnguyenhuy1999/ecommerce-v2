import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { EmitEventDto } from './dto/event-streaming.dto'
import { buildPaginationMeta, PaginationDto } from '../common/dto/pagination.dto'
import { randomUUID } from 'crypto'

@Injectable()
export class EventStreamingService {
  async emitEvent(dto: EmitEventDto) {
    return prisma.platformEvent.create({
      data: {
        eventType: dto.eventType,
        source: dto.source,
        payload: dto.payload ?? {},
        metadata: dto.metadata ?? {},
        idempotencyKey: randomUUID(),
      },
    })
  }

  async listEvents(query: PaginationDto & { eventType?: string; source?: string }) {
    const { page = 1, limit = 20 } = query

    const where: Prisma.PlatformEventWhereInput = {
      ...(query.eventType && { eventType: query.eventType }),
      ...(query.source && { source: query.source }),
    }

    const [events, total] = await Promise.all([
      prisma.platformEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.platformEvent.count({ where }),
    ])

    return { data: events, meta: buildPaginationMeta(page, limit, total) }
  }

  async getEventById(id: string) {
    const event = await prisma.platformEvent.findUnique({ where: { id } })
    if (!event) throw new NotFoundException('Event not found')
    return event
  }

  async replayEvent(id: string) {
    const event = await prisma.platformEvent.findUnique({ where: { id } })
    if (!event) throw new NotFoundException('Event not found')

    return prisma.platformEvent.create({
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
    const totalEvents = await prisma.platformEvent.count()

    const recentEvents = await prisma.platformEvent.count({
      where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    })

    const failedEvents = await prisma.platformEvent.count({
      where: { status: 'FAILED' },
    })

    return { totalEvents, recentEvents, failedEvents }
  }

  async markEventProcessed(id: string) {
    return prisma.platformEvent.update({
      where: { id },
      data: { status: 'PROCESSED', processedAt: new Date() },
    })
  }

  async markEventFailed(id: string, error: string) {
    const event = await prisma.platformEvent.findUnique({ where: { id } })
    if (!event) throw new NotFoundException('Event not found')

    return prisma.platformEvent.update({
      where: { id },
      data: {
        status: 'FAILED',
        retryCount: { increment: 1 },
        metadata: { ...((event.metadata as Record<string, unknown>) ?? {}), lastError: error },
      },
    })
  }
}
