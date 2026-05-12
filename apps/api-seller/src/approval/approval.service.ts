import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { ApprovalStatus } from '@ecom/contracts/enums'
import { ApprovalQueryDto } from './dto/approval-query.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'

@Injectable()
export class ApprovalService {
  constructor(private readonly prisma: PrismaService) {}
  async list(shopId: string, query: ApprovalQueryDto) {
    const {
      page = 1,
      pageSize = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      sort,
      order,
    } = query

    const finalSort = sort || sortBy
    const finalOrder = order || sortOrder

    const where: Prisma.ProductApprovalWhereInput = {
      shopId,
    }
    if (status !== undefined) {
      where.status = status
    }

    const { items, total } = await offsetPaginate(this.prisma.productApproval, {
      page,
      limit: pageSize,
      where,
      include: {
        history: { orderBy: { createdAt: 'desc' }, take: 3 },
      },
      orderBy: { [finalSort]: finalOrder },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async getById(shopId: string, approvalId: string) {
    const approval = await this.prisma.productApproval.findFirst({
      where: { id: approvalId, shopId },
      include: {
        history: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!approval) {
      throw new NotFoundException('Approval request not found')
    }

    return approval
  }

  async submitForReview(shopId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, shopId, deletedAt: null },
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    const existing = await this.prisma.productApproval.findFirst({
      where: { productId, status: ApprovalStatus.PENDING_REVIEW },
    })

    if (existing) {
      throw new BadRequestException('Product already has a pending approval request')
    }

    const latestApproval = await this.prisma.productApproval.findFirst({
      where: { productId },
      orderBy: { version: 'desc' },
    })

    return this.prisma.productApproval.create({
      data: {
        productId,
        shopId,
        status: ApprovalStatus.PENDING_REVIEW,
        version: (latestApproval?.version ?? 0) + 1,
      },
    })
  }

  async resubmit(shopId: string, approvalId: string) {
    const approval = await this.prisma.productApproval.findFirst({
      where: { id: approvalId, shopId },
    })

    if (!approval) {
      throw new NotFoundException('Approval request not found')
    }

    if (
      approval.status !== ApprovalStatus.REVISION_REQUESTED &&
      approval.status !== ApprovalStatus.REJECTED
    ) {
      throw new BadRequestException('Can only resubmit revision-requested or rejected approvals')
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.productApproval.update({
        where: { id: approvalId },
        data: {
          status: ApprovalStatus.PENDING_REVIEW,
          version: { increment: 1 },
        },
      })

      await tx.productApprovalHistory.create({
        data: {
          approvalId,
          fromStatus: approval.status,
          toStatus: ApprovalStatus.PENDING_REVIEW,
          note: 'Resubmitted for review',
        },
      })

      return updated
    })
  }

  async getByProduct(shopId: string, productId: string) {
    return this.prisma.productApproval.findMany({
      where: { productId, shopId },
      include: { history: { orderBy: { createdAt: 'desc' } } },
      orderBy: { version: 'desc' },
    })
  }
}
