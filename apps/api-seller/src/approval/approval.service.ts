import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { ApprovalQueryDto } from './dto/approval-query.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/pagination'

@Injectable()
export class ApprovalService {
  async list(shopId: string, query: ApprovalQueryDto) {
    const { page = 1, pageSize = 20, sort = 'createdAt', order = 'desc', status } = query

    const where: Prisma.ProductApprovalWhereInput = {
      shopId,
      ...(status ? { status: status as Prisma.ProductApprovalWhereInput['status'] } : {}),
    }

    const { items, total } = await offsetPaginate(prisma.productApproval, {
      page,
      pageSize,
      where,
      include: {
        history: { orderBy: { createdAt: 'desc' }, take: 3 },
      },
      orderBy: { [sort]: order },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async getById(shopId: string, approvalId: string) {
    const approval = await prisma.productApproval.findFirst({
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
    const product = await prisma.product.findFirst({
      where: { id: productId, shopId, deletedAt: null },
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    const existing = await prisma.productApproval.findFirst({
      where: { productId, status: 'PENDING_REVIEW' },
    })

    if (existing) {
      throw new BadRequestException('Product already has a pending approval request')
    }

    const latestApproval = await prisma.productApproval.findFirst({
      where: { productId },
      orderBy: { version: 'desc' },
    })

    return prisma.productApproval.create({
      data: {
        productId,
        shopId,
        status: 'PENDING_REVIEW',
        version: (latestApproval?.version ?? 0) + 1,
      },
    })
  }

  async resubmit(shopId: string, approvalId: string) {
    const approval = await prisma.productApproval.findFirst({
      where: { id: approvalId, shopId },
    })

    if (!approval) {
      throw new NotFoundException('Approval request not found')
    }

    if (approval.status !== 'REVISION_REQUESTED' && approval.status !== 'REJECTED') {
      throw new BadRequestException('Can only resubmit revision-requested or rejected approvals')
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.productApproval.update({
        where: { id: approvalId },
        data: {
          status: 'PENDING_REVIEW',
          version: { increment: 1 },
        },
      })

      await tx.productApprovalHistory.create({
        data: {
          approvalId,
          fromStatus: approval.status,
          toStatus: 'PENDING_REVIEW',
          note: 'Resubmitted for review',
        },
      })

      return updated
    })
  }

  async getByProduct(shopId: string, productId: string) {
    return prisma.productApproval.findMany({
      where: { productId, shopId },
      include: { history: { orderBy: { createdAt: 'desc' } } },
      orderBy: { version: 'desc' },
    })
  }
}
