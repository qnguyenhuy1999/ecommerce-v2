import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService, type ProductStatus, type ProductReportStatus, Prisma } from '@ecom/database';
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: ProductStatus;
    shopId?: string;
    categoryId?: string;
  }) {
    const where: Prisma.ProductWhereInput = { deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.shopId) where.shopId = query.shopId;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { baseSku: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { items, total } = await offsetPaginate(this.prisma.product, {
      page: query.page,
      pageSize: query.pageSize,
      where,
      include: {
        shop: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        images: { where: { isCover: true }, take: 1 },
        _count: { select: { variants: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return buildOffsetResponse(items, query.page ?? 1, query.pageSize ?? 20, total);
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
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async approve(id: string) {
    const product = await this.findById(id);
    if (product.status !== 'DRAFT') {
      throw new BadRequestException('Invalid status transition');
    }
    return this.prisma.product.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });
  }

  async reject(id: string) {
    const product = await this.findById(id);
    if (product.status !== 'DRAFT') {
      throw new BadRequestException('Invalid status transition');
    }
    return this.prisma.product.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async hide(id: string) {
    const product = await this.findById(id);
    if (product.status !== 'PUBLISHED') {
      throw new BadRequestException('Invalid status transition');
    }
    return this.prisma.product.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }

  async unhide(id: string) {
    const product = await this.findById(id);
    if (product.status !== 'ARCHIVED') {
      throw new BadRequestException('Invalid status transition');
    }
    return this.prisma.product.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });
  }

  async bulkApprove(ids: string[]) {
    return this.prisma.product.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { status: 'PUBLISHED' },
    });
  }

  async bulkReject(ids: string[]) {
    return this.prisma.product.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { status: 'REJECTED' },
    });
  }

  async getStatusCounts() {
    const counts = await this.prisma.product.groupBy({
      by: ['status'],
      _count: { status: true },
      where: { deletedAt: null },
    });
    const result: Record<string, number> = {};
    for (const item of counts) {
      result[item.status] = item._count.status;
    }
    return result;
  }

  // Reports
  async findReports(query: {
    page?: number;
    pageSize?: number;
    status?: ProductReportStatus;
  }) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const { items, total } = await offsetPaginate(this.prisma.productReport, {
      page: query.page,
      pageSize: query.pageSize,
      where,
      orderBy: { createdAt: 'desc' },
    });

    return buildOffsetResponse(items, query.page ?? 1, query.pageSize ?? 20, total);
  }

  async resolveReport(id: string, adminId: string, adminNote?: string) {
    return this.prisma.productReport.update({
      where: { id },
      data: { status: 'RESOLVED', resolvedBy: adminId, resolvedAt: new Date(), adminNote },
    });
  }

  async dismissReport(id: string, adminId: string, adminNote?: string) {
    return this.prisma.productReport.update({
      where: { id },
      data: { status: 'DISMISSED', resolvedBy: adminId, resolvedAt: new Date(), adminNote },
    });
  }
}
