import { ReturnStatus } from '@ecom/contracts/enums'
import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { ReturnQueryDto } from './dto/return-query.dto'

const VALID_TRANSITIONS: Partial<Record<ReturnStatus, ReturnStatus[]>> = {
  [ReturnStatus.REQUESTED]: [ReturnStatus.REVIEWING, ReturnStatus.REJECTED],
  [ReturnStatus.REVIEWING]: [ReturnStatus.APPROVED, ReturnStatus.REJECTED],
  [ReturnStatus.APPROVED]: [ReturnStatus.RETURN_SHIPPING],
  [ReturnStatus.REJECTED]: [ReturnStatus.CLOSED],
  [ReturnStatus.RETURN_SHIPPING]: [ReturnStatus.RECEIVED],
  [ReturnStatus.RECEIVED]: [ReturnStatus.REFUNDED],
  [ReturnStatus.REFUNDED]: [ReturnStatus.CLOSED],
  [ReturnStatus.CLOSED]: [],
}

@Injectable()
export class ReturnService {
  constructor(private readonly prisma: PrismaService) {}
  async list(shopId: string, query: ReturnQueryDto) {
    const {
      page = 1,
      limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      status,
    } = query

    const finalSort = sortBy
    const finalOrder = sortOrder

    const where: Prisma.ReturnRequestWhereInput = { shopId }
    if (status !== undefined) where.status = status
    if (search) where.description = { contains: search, mode: 'insensitive' }

    const { items, total } = await offsetPaginate(this.prisma.returnRequest, {
      page,
      limit,
      where,
      include: {
        items: true,
        _count: { select: { evidence: true, timeline: true } },
      },
      orderBy: { [finalSort]: finalOrder },
    })

    return buildOffsetResponse(items, page, limit, total)
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
    newStatus: ReturnStatus,
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
        status: newStatus,
      }

      if (newStatus === ReturnStatus.REFUNDED || newStatus === ReturnStatus.CLOSED) {
        data.resolvedAt = new Date()
      }

      const updated = await tx.returnRequest.update({
        where: { id: returnId },
        data,
      })

      const timelineData: Prisma.ReturnTimelineUncheckedCreateInput = {
        returnRequestId: returnId,
        fromStatus: currentStatus,
        toStatus: newStatus,
      }

      if (note !== undefined) {
        timelineData.note = note
      }

      if (performedBy !== undefined) {
        timelineData.performedBy = performedBy
      }

      await tx.returnTimeline.create({ data: timelineData })

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

    const evidenceData: Prisma.ReturnEvidenceUncheckedCreateInput = {
      returnRequestId: returnId,
      uploadedBy,
      url,
    }

    if (description !== undefined) {
      evidenceData.description = description
    }

    return this.prisma.returnEvidence.create({ data: evidenceData })
  }

  async getStats(shopId: string) {
    const [total, pending, approved, refunded] = await Promise.all([
      this.prisma.returnRequest.count({ where: { shopId } }),
      this.prisma.returnRequest.count({
        where: { shopId, status: { in: [ReturnStatus.REQUESTED, ReturnStatus.REVIEWING] } },
      }),
      this.prisma.returnRequest.count({ where: { shopId, status: ReturnStatus.APPROVED } }),
      this.prisma.returnRequest.count({ where: { shopId, status: ReturnStatus.REFUNDED } }),
    ])

    return { total, pending, approved, refunded }
  }
}
