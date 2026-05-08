import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { prisma, type Prisma, type ReturnStatus } from '@ecom/database'
import { buildPaginationMeta } from '@ecom/common'

@Injectable()
export class RefundsService {
  async findAll(query: { page?: number; pageSize?: number; status?: ReturnStatus }) {
    const page = query.page ?? 1
    const pageSize = Math.min(query.pageSize ?? 20, 100)
    const skip = (page - 1) * pageSize

    const where: Record<string, unknown> = {}
    if (query.status) where.status = query.status

    const [items, total] = await Promise.all([
      prisma.returnRequest.findMany({
        where,
        include: {
          items: true,
          evidence: true,
          timeline: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.returnRequest.count({ where }),
    ])

    return { items, meta: buildPaginationMeta(page, pageSize, total) }
  }

  async findById(id: string) {
    const refund = await prisma.returnRequest.findUnique({
      where: { id },
      include: {
        items: true,
        evidence: true,
        timeline: { orderBy: { createdAt: 'desc' } },
      },
    })
    if (!refund) throw new NotFoundException('Return request not found')
    return refund
  }

  async approve(id: string, adminId: string, note?: string) {
    const refund = await this.findById(id)
    const fromStatus = refund.status

    if (fromStatus !== 'REQUESTED' && fromStatus !== 'REVIEWING') {
      throw new BadRequestException('Invalid status transition')
    }

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const result = await tx.returnRequest.update({
        where: { id },
        data: { status: 'APPROVED', resolvedAt: new Date() },
      })
      await tx.returnTimeline.create({
        data: {
          returnRequestId: id,
          fromStatus,
          toStatus: 'APPROVED',
          note,
          performedBy: adminId,
        },
      })
      return result
    })

    return updated
  }

  async reject(id: string, adminId: string, note?: string) {
    const refund = await this.findById(id)
    const fromStatus = refund.status

    if (fromStatus !== 'REQUESTED' && fromStatus !== 'REVIEWING') {
      throw new BadRequestException('Invalid status transition')
    }

    const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const result = await tx.returnRequest.update({
        where: { id },
        data: { status: 'REJECTED', resolvedAt: new Date() },
      })
      await tx.returnTimeline.create({
        data: {
          returnRequestId: id,
          fromStatus,
          toStatus: 'REJECTED',
          note,
          performedBy: adminId,
        },
      })
      return result
    })

    return updated
  }

  async getStatusCounts() {
    const counts = await prisma.returnRequest.groupBy({
      by: ['status'],
      _count: { status: true },
    })
    const result: Record<string, number> = {}
    for (const item of counts) {
      result[item.status] = item._count.status
    }
    return result
  }
}
