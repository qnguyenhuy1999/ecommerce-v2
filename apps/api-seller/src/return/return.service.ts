import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import type { PrismaService} from '@ecom/database';
import { type Prisma } from '@ecom/database'
import type { ReturnQueryDto } from './dto/return-query.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'

const VALID_TRANSITIONS: Record<string, string[]> = {
  REQUESTED: ['REVIEWING', 'REJECTED'],
  REVIEWING: ['APPROVED', 'REJECTED'],
  APPROVED: ['RETURN_SHIPPING'],
  REJECTED: ['CLOSED'],
  RETURN_SHIPPING: ['RECEIVED'],
  RECEIVED: ['REFUNDED'],
  REFUNDED: ['CLOSED'],
  CLOSED: [],
}

@Injectable()
export class ReturnService {
  constructor(private readonly prisma: PrismaService) {}
  async list(shopId: string, query: ReturnQueryDto) {
    const {
      page = 1,
      pageSize = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      status,
      sort,
      order,
    } = query

    const finalSort = sort || sortBy
    const finalOrder = order || sortOrder

    const where: Prisma.ReturnRequestWhereInput = {
      shopId,
      ...(status ? { status: status as Prisma.ReturnRequestWhereInput['status'] } : {}),
      ...(search ? { description: { contains: search, mode: 'insensitive' } } : {}),
    }

    const { items, total } = await offsetPaginate(this.prisma.returnRequest, {
      page,
      pageSize,
      where,
      include: {
        items: true,
        _count: { select: { evidence: true, timeline: true } },
      },
      orderBy: { [finalSort]: finalOrder },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async getById(shopId: string, returnId: string) {
    const returnRequest = await this.prisma.returnRequest.findFirst({
      where: { id: returnId, shopId },
      include: {
        items: true,
        evidence: { orderBy: { createdAt: 'desc' } },
        timeline: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!returnRequest) {
      throw new NotFoundException('Return request not found')
    }

    return returnRequest
  }

  async updateStatus(
    shopId: string,
    returnId: string,
    newStatus: string,
    note?: string,
    performedBy?: string,
  ) {
    const returnRequest = await this.prisma.returnRequest.findFirst({
      where: { id: returnId, shopId },
    })

    if (!returnRequest) {
      throw new NotFoundException('Return request not found')
    }

    const currentStatus = returnRequest.status
    const allowed = VALID_TRANSITIONS[currentStatus] ?? []

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}. Allowed: ${allowed.join(', ')}`,
      )
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const data: Prisma.ReturnRequestUpdateInput = {
        status: newStatus as Prisma.ReturnRequestUpdateInput['status'],
      }

      if (newStatus === 'REFUNDED' || newStatus === 'CLOSED') {
        data.resolvedAt = new Date()
      }

      const updated = await tx.returnRequest.update({
        where: { id: returnId },
        data,
      })

      await tx.returnTimeline.create({
        data: {
          returnRequestId: returnId,
          fromStatus: currentStatus,
          toStatus: newStatus,
          note,
          performedBy,
        },
      })

      return updated
    })
  }

  async addEvidence(
    shopId: string,
    returnId: string,
    uploadedBy: string,
    url: string,
    description?: string,
  ) {
    const returnRequest = await this.prisma.returnRequest.findFirst({
      where: { id: returnId, shopId },
    })

    if (!returnRequest) {
      throw new NotFoundException('Return request not found')
    }

    return this.prisma.returnEvidence.create({
      data: { returnRequestId: returnId, uploadedBy, url, description },
    })
  }

  async getStats(shopId: string) {
    const [total, pending, approved, refunded] = await Promise.all([
      this.prisma.returnRequest.count({ where: { shopId } }),
      this.prisma.returnRequest.count({
        where: { shopId, status: { in: ['REQUESTED', 'REVIEWING'] } },
      }),
      this.prisma.returnRequest.count({ where: { shopId, status: 'APPROVED' } }),
      this.prisma.returnRequest.count({ where: { shopId, status: 'REFUNDED' } }),
    ])

    return { total, pending, approved, refunded }
  }
}
