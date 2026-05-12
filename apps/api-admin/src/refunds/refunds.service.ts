import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import type { PrismaService, Prisma } from '@ecom/database'
import { type ReturnStatus, ReturnStatus as RTS } from '@ecom/contracts/enums'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { withDefined, nullable } from '@ecom/shared/utils'

@Injectable()
export class RefundsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: { page?: number; limit?: number; status?: ReturnStatus }) {
    const where: Prisma.ReturnRequestWhereInput = {}
    if (query.status) where.status = query.status

    const { items, total } = await offsetPaginate(this.prisma.returnRequest, {
      ...withDefined({ page: query.page, limit: query.limit }),
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        evidence: true,
        timeline: { orderBy: { createdAt: 'desc' } },
      },
    })

    return buildOffsetResponse(items, query.page ?? 1, query.limit ?? 20, total)
  }

  async findById(id: string) {
    const refund = await this.prisma.returnRequest.findUnique({
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

    if (fromStatus !== RTS.REQUESTED && fromStatus !== RTS.REVIEWING) {
      throw new BadRequestException('Invalid status transition')
    }

    const updated = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const result = await tx.returnRequest.update({
        where: { id },
        data: { status: RTS.APPROVED, resolvedAt: new Date() },
      })
      await tx.returnTimeline.create({
        data: {
          returnRequestId: id,
          fromStatus,
          toStatus: RTS.APPROVED,
          note: nullable(note),
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

    if (fromStatus !== RTS.REQUESTED && fromStatus !== RTS.REVIEWING) {
      throw new BadRequestException('Invalid status transition')
    }

    const updated = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const result = await tx.returnRequest.update({
        where: { id },
        data: { status: RTS.REJECTED, resolvedAt: new Date() },
      })
      await tx.returnTimeline.create({
        data: {
          returnRequestId: id,
          fromStatus,
          toStatus: RTS.REJECTED,
          note: nullable(note),
          performedBy: adminId,
        },
      })
      return result
    })

    return updated
  }

  async getStatusCounts() {
    const counts = await this.prisma.returnRequest.groupBy({
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
