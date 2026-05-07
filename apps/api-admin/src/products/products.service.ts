import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, type ProductStatus, type ProductReportStatus } from '@ecom/database';
import { buildPaginationMeta } from '@ecom/common';

@Injectable()
export class ProductsService {
  async findAll(query: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: ProductStatus;
    shopId?: string;
    categoryId?: string;
  }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = { deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.shopId) where.shopId = query.shopId;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { baseSku: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          shop: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
          images: { where: { isCover: true }, take: 1 },
          _count: { select: { variants: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(page, pageSize, total) };
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
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
    await this.findById(id);
    return prisma.product.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });
  }

  async reject(id: string) {
    await this.findById(id);
    return prisma.product.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async hide(id: string) {
    await this.findById(id);
    return prisma.product.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }

  async unhide(id: string) {
    await this.findById(id);
    return prisma.product.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });
  }

  async bulkApprove(ids: string[]) {
    return prisma.product.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { status: 'PUBLISHED' },
    });
  }

  async bulkReject(ids: string[]) {
    return prisma.product.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { status: 'REJECTED' },
    });
  }

  async getStatusCounts() {
    const counts = await prisma.product.groupBy({
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
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;

    const [items, total] = await Promise.all([
      prisma.productReport.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.productReport.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(page, pageSize, total) };
  }

  async resolveReport(id: string, adminId: string, adminNote?: string) {
    return prisma.productReport.update({
      where: { id },
      data: { status: 'RESOLVED', resolvedBy: adminId, resolvedAt: new Date(), adminNote },
    });
  }

  async dismissReport(id: string, adminId: string, adminNote?: string) {
    return prisma.productReport.update({
      where: { id },
      data: { status: 'DISMISSED', resolvedBy: adminId, resolvedAt: new Date(), adminNote },
    });
  }
}
