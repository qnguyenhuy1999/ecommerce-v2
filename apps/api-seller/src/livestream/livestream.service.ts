import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import type { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { withDefined } from '@ecom/shared/utils'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { AddLivestreamProductDto, CreateLivestreamDto } from './dto/livestream.dto'

@Injectable()
export class LivestreamService {
  constructor(private readonly prisma: PrismaService) {}
  async listSessions(shopId: string, query: OffsetPaginationDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT } = query

    const where: Prisma.LivestreamSessionWhereInput = { shopId }

    const { items, total } = await offsetPaginate(this.prisma.livestreamSession, {
      page,
      limit,
      where,
      include: { _count: { select: { products: true, chatMessages: true } } },
      orderBy: { scheduledAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async getSessionById(shopId: string, id: string) {
    const session = await this.prisma.livestreamSession.findFirst({
      where: { id, shopId },
      include: {
        products: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { chatMessages: true } },
      },
    })

    if (!session) throw new NotFoundException('Livestream session not found')
    return session
  }

  async createSession(shopId: string, dto: CreateLivestreamDto) {
    return this.prisma.livestreamSession.create({
      data: {
        shopId,
        title: dto.title,
        ...withDefined({ description: dto.description }),
        ...withDefined({ thumbnailUrl: dto.thumbnailUrl }),
        scheduledAt: new Date(dto.scheduledAt),
      },
    })
  }

  async startStream(shopId: string, sessionId: string) {
    const session = await this.prisma.livestreamSession.findFirst({
      where: { id: sessionId, shopId },
    })

    if (!session) throw new NotFoundException('Session not found')
    if (session.status !== 'SCHEDULED') {
      throw new BadRequestException('Session is not in scheduled state')
    }

    return this.prisma.livestreamSession.update({
      where: { id: sessionId },
      data: { status: 'LIVE', startedAt: new Date() },
    })
  }

  async endStream(shopId: string, sessionId: string) {
    const session = await this.prisma.livestreamSession.findFirst({
      where: { id: sessionId, shopId },
    })

    if (!session) throw new NotFoundException('Session not found')
    if (session.status !== 'LIVE') {
      throw new BadRequestException('Session is not live')
    }

    return this.prisma.livestreamSession.update({
      where: { id: sessionId },
      data: { status: 'ENDED', endedAt: new Date() },
    })
  }

  async addProduct(shopId: string, sessionId: string, dto: AddLivestreamProductDto) {
    const session = await this.prisma.livestreamSession.findFirst({
      where: { id: sessionId, shopId },
    })
    if (!session) throw new NotFoundException('Session not found')

    return this.prisma.livestreamProduct.create({
      data: {
        sessionId,
        productId: dto.productId,
        ...withDefined({ specialPrice: dto.specialPrice }),
      },
    })
  }

  async pinProduct(shopId: string, sessionId: string, productId: string, isPinned: boolean) {
    const session = await this.prisma.livestreamSession.findFirst({
      where: { id: sessionId, shopId },
    })
    if (!session) throw new NotFoundException('Session not found')

    if (isPinned) {
      await this.prisma.livestreamProduct.updateMany({
        where: { sessionId, isPinned: true },
        data: { isPinned: false, pinnedAt: null },
      })
    }

    return this.prisma.livestreamProduct.update({
      where: { sessionId_productId: { sessionId, productId } },
      data: { isPinned, pinnedAt: isPinned ? new Date() : null },
    })
  }

  async updateViewerCount(sessionId: string, viewerCount: number) {
    const session = await this.prisma.livestreamSession.findUnique({ where: { id: sessionId } })
    if (!session) return

    await this.prisma.livestreamSession.update({
      where: { id: sessionId },
      data: {
        viewerCount,
        peakViewers: viewerCount > session.peakViewers ? viewerCount : session.peakViewers,
      },
    })
  }
}
