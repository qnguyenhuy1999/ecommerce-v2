import { Injectable } from '@nestjs/common'
import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { offsetPaginate } from '@ecom/shared/pagination/prisma'

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findVariants(
    where: Prisma.ProductVariantWhereInput,
    options: { page: number; limit: number },
  ) {
    return offsetPaginate(this.prisma.productVariant, {
      page: options.page,
      limit: options.limit,
      where,
      include: {
        product: { select: { id: true, name: true, shopId: true } },
        optionValues: { include: { option: { include: { group: true } } } },
      },
      orderBy: { stock: 'asc' },
    })
  }

  async findVariant(where: Prisma.ProductVariantWhereInput) {
    return this.prisma.productVariant.findFirst({ where })
  }

  async findLowStockVariants(where: Prisma.ProductVariantWhereInput) {
    return this.prisma.productVariant.findMany({
      where,
      include: {
        product: { select: { id: true, name: true } },
        optionValues: { include: { option: { include: { group: true } } } },
      },
      orderBy: { stock: 'asc' },
      take: 50,
    })
  }

  async updateVariantStock(id: string, data: Prisma.ProductVariantUpdateInput) {
    return this.prisma.productVariant.update({ where: { id }, data })
  }

  async createInventoryTransaction(data: Prisma.InventoryTransactionCreateInput) {
    return this.prisma.inventoryTransaction.create({ data })
  }

  async findTransactions(
    where: Prisma.InventoryTransactionWhereInput,
    options: { page: number; pageSize: number },
  ) {
    return offsetPaginate(this.prisma.inventoryTransaction, {
      page: options.page,
      pageSize: options.pageSize,
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn)
  }
}
