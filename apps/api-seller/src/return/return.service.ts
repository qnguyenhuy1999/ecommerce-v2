import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { ReturnQueryDto } from './dto/return-query.dto'
import { buildPaginationMeta } from '../common/dto/pagination.dto'

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
  async list(shopId: string, query: ReturnQueryDto) {
    const { page = 1, limit = 20, sort = 'createdAt', order = 'desc', search, status } = query

    const where: Prisma.ReturnRequestWhereInput = {
      shopId,
      ...(status ? { status: status as Prisma.ReturnRequestWhereInput['status'] } : {}),
      ...(search ? { description: { contains: search, mode: 'insensitive' } } : {}),
    }

    const [returns, total] = await Promise.all([
      prisma.returnRequest.findMany({
        where,
        include: {
          items: true,
          _count: { select: { evidence: true, timeline: true } },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.returnRequest.count({ where }),
    ])

    return { data: returns, meta: buildPaginationMeta(page, limit, total) }
  }

  async getById(shopId: string, returnId: string) {
    const returnRequest = await prisma.returnRequest.findFirst({
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

  async updateStatus(shopId: string, returnId: string, newStatus: string, note?: string, performedBy?: string) {
    const returnRequest = await prisma.returnRequest.findFirst({
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

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

  async addEvidence(shopId: string, returnId: string, uploadedBy: string, url: string, description?: string) {
    const returnRequest = await prisma.returnRequest.findFirst({
      where: { id: returnId, shopId },
    })

    if (!returnRequest) {
      throw new NotFoundException('Return request not found')
    }

    return prisma.returnEvidence.create({
      data: { returnRequestId: returnId, uploadedBy, url, description },
    })
  }

  async getStats(shopId: string) {
    const [total, pending, approved, refunded] = await Promise.all([
      prisma.returnRequest.count({ where: { shopId } }),
      prisma.returnRequest.count({ where: { shopId, status: { in: ['REQUESTED', 'REVIEWING'] } } }),
      prisma.returnRequest.count({ where: { shopId, status: 'APPROVED' } }),
      prisma.returnRequest.count({ where: { shopId, status: 'REFUNDED' } }),
    ])

    return { total, pending, approved, refunded }
  }
}
