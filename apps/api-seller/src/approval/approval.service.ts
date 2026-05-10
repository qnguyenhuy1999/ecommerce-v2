import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { ApprovalQueryDto } from './dto/approval-query.dto'
import { buildPaginatedResponse } from '@ecom/shared/pagination/core'
import { offsetPaginate } from '@ecom/shared/pagination/prisma'

@Injectable()
export class ApprovalService {
  constructor(private readonly prisma: PrismaService) {}
  async list(shopId: string, query: ApprovalQueryDto) {
    const { page = 1, pageSize = 20, sort = 'createdAt', order = 'desc', status } = query

    const where: Prisma.ProductApprovalWhereInput = {
      shopId,
      ...(status ? { status: status as Prisma.ProductApprovalWhereInput['status'] } : {}),
    }

    const pageNum = page;
    const limit = pageSize;

    const result = await offsetPaginate({
      model: this.prisma.productApproval,
      params: { page: pageNum, limit, sortBy: sort, sortOrder: order },
      where,
      include: {
        history: { orderBy: { createdAt: 'desc' }, take: 3 },
      },
      orderBy: { [sort]: order },
    });

    return buildPaginatedResponse(result.data, result.total, { page: pageNum, limit, sortBy: sort, sortOrder: order });

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
      where: { productId, status: 'PENDING_REVIEW' },
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
        status: 'PENDING_REVIEW',
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

    if (approval.status !== 'REVISION_REQUESTED' && approval.status !== 'REJECTED') {
      throw new BadRequestException('Can only resubmit revision-requested or rejected approvals')
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
    return this.prisma.productApproval.findMany({
      where: { productId, shopId },
      include: { history: { orderBy: { createdAt: 'desc' } } },
      orderBy: { version: 'desc' },
    })
  }
}
