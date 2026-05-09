import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { CreateLivestreamDto, AddLivestreamProductDto } from './dto/livestream.dto'
import { offsetPaginate, buildOffsetResponse, OffsetPaginationDto } from '@ecom/pagination'

@Injectable()
export class LivestreamService {
  constructor(private readonly prisma: PrismaService) {}
  async listSessions(shopId: string, query: OffsetPaginationDto) {
    const { page = 1, pageSize = 20 } = query

    const where: Prisma.LivestreamSessionWhereInput = { shopId }

    const { items, total } = await offsetPaginate(this.prisma.livestreamSession, {
      page,
      pageSize,
      where,
      include: { _count: { select: { products: true, chatMessages: true } } },
      orderBy: { scheduledAt: 'desc' },
    })

    return buildOffsetResponse(items, page, pageSize, total)
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
        description: dto.description,
        thumbnailUrl: dto.thumbnailUrl,
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
        specialPrice: dto.specialPrice,
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
