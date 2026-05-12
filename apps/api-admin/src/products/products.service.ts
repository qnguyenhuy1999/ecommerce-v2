import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import type { PrismaService, Prisma } from '@ecom/database'
import { type ProductStatus, type ProductReportStatus, ProductStatus as PS, ProductReportStatus as PRS } from '@ecom/contracts/enums'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { withDefined, nullable } from '@ecom/shared/utils'

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: {
    page?: number
    limit?: number
    search?: string
    status?: ProductStatus
    shopId?: string
    categoryId?: string
  }) {
    const where: Prisma.ProductWhereInput = { deletedAt: null }
    if (query.status) where.status = query.status
    if (query.shopId) where.shopId = query.shopId
    if (query.categoryId) where.categoryId = query.categoryId
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { baseSku: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    const { items, total } = await offsetPaginate(this.prisma.product, {
      ...withDefined({ page: query.page, limit: query.limit }),
      where,
      include: {
        shop: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        images: { where: { isCover: true }, take: 1 },
        _count: { select: { variants: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, query.page ?? 1, query.limit ?? 20, total)
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: {
        shop: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        variants: {
          include: { optionValues: { include: { option: { include: { group: true } } } } },
          orderBy: { createdAt: 'asc' },
        },
        variantOptionGroups: {
          include: { options: { orderBy: { sortOrder: 'asc' } } },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!product) throw new NotFoundException('Product not found')
    return product
  }

  async approve(id: string) {
    const product = await this.findById(id)
    if (product.status !== PS.DRAFT) {
      throw new BadRequestException('Invalid status transition')
    }
    return this.prisma.product.update({
      where: { id },
      data: { status: PS.PUBLISHED },
    })
  }

  async reject(id: string) {
    const product = await this.findById(id)
    if (product.status !== PS.DRAFT) {
      throw new BadRequestException('Invalid status transition')
    }
    return this.prisma.product.update({
      where: { id },
      data: { status: PS.REJECTED },
    })
  }

  async hide(id: string) {
    const product = await this.findById(id)
    if (product.status !== PS.PUBLISHED) {
      throw new BadRequestException('Invalid status transition')
    }
    return this.prisma.product.update({
      where: { id },
      data: { status: PS.ARCHIVED },
    })
  }

  async unhide(id: string) {
    const product = await this.findById(id)
    if (product.status !== PS.ARCHIVED) {
      throw new BadRequestException('Invalid status transition')
    }
    return this.prisma.product.update({
      where: { id },
      data: { status: PS.PUBLISHED },
    })
  }

  async bulkApprove(ids: string[]) {
    return this.prisma.product.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { status: PS.PUBLISHED },
    })
  }

  async bulkReject(ids: string[]) {
    return this.prisma.product.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { status: PS.REJECTED },
    })
  }

  async getStatusCounts() {
    const counts = await this.prisma.product.groupBy({
      by: ['status'],
      _count: { status: true },
      where: { deletedAt: null },
    })
    const result: Record<string, number> = {}
    for (const item of counts) {
      result[item.status] = item._count.status
    }
    return result
  }

  // Reports
  async findReports(query: { page?: number; limit?: number; status?: ProductReportStatus }) {
    const where: Record<string, unknown> = {}
    if (query.status) where.status = query.status

    const { items, total } = await offsetPaginate(this.prisma.productReport, {
      ...withDefined({ page: query.page, limit: query.limit }),
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, query.page ?? 1, query.limit ?? 20, total)
  }

  async resolveReport(id: string, adminId: string, adminNote?: string) {
    return this.prisma.productReport.update({
      where: { id },
      data: {
        status: PRS.RESOLVED,
        resolvedBy: adminId,
        resolvedAt: new Date(),
        adminNote: nullable(adminNote),
      },
    })
  }

  async dismissReport(id: string, adminId: string, adminNote?: string) {
    return this.prisma.productReport.update({
      where: { id },
      data: {
        status: PRS.DISMISSED,
        resolvedBy: adminId,
        resolvedAt: new Date(),
        adminNote: nullable(adminNote),
      },
    })
  }
}
