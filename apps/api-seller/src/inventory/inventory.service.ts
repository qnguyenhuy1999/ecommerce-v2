import { Injectable, BadRequestException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { InventoryQueryDto } from './dto/inventory-query.dto'
import { buildPaginationMeta } from '../common/dto/pagination.dto'

const LOW_STOCK_THRESHOLD = 10

@Injectable()
export class InventoryService {
  async list(shopId: string, query: InventoryQueryDto) {
    const { page = 1, limit = 20, search, lowStock } = query

    const where: Prisma.ProductVariantWhereInput = {
      product: { shopId, deletedAt: null },
      ...(search
        ? {
            OR: [
              { sku: { contains: search, mode: 'insensitive' } },
              { product: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
      ...(lowStock ? { stock: { lte: LOW_STOCK_THRESHOLD } } : {}),
    }

    const [variants, total] = await Promise.all([
      prisma.productVariant.findMany({
        where,
        include: {
          product: { select: { id: true, name: true, shopId: true } },
          optionValues: { include: { option: { include: { group: true } } } },
        },
        orderBy: { stock: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.productVariant.count({ where }),
    ])

    const data = variants.map((v: typeof variants[number]) => ({
      variantId: v.id,
      productId: v.product.id,
      productName: v.product.name,
      sku: v.sku,
      stock: v.stock,
      reservedStock: v.reservedStock,
      availableStock: v.stock - v.reservedStock,
      isLowStock: v.stock <= LOW_STOCK_THRESHOLD,
      options: v.optionValues.map((ov: typeof v.optionValues[number]) => ({
        group: ov.option.group.name,
        value: ov.option.value,
      })),
    }))

    return { data, meta: buildPaginationMeta(page, limit, total) }
  }

  async updateStock(shopId: string, variantId: string, quantity: number, type: string, note?: string) {
    const variant = await prisma.productVariant.findFirst({
      where: { id: variantId, product: { shopId, deletedAt: null } },
    })

    if (!variant) {
      throw new BadRequestException('Variant not found')
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let newStock = variant.stock

      if (type === 'STOCK_IN') {
        newStock += quantity
      } else if (type === 'STOCK_OUT') {
        if (variant.stock - variant.reservedStock < quantity) {
          throw new BadRequestException('Insufficient available stock')
        }
        newStock -= quantity
      } else if (type === 'ADJUSTMENT') {
        newStock = quantity
      } else {
        throw new BadRequestException('Invalid transaction type')
      }

      await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: newStock },
      })

      await tx.inventoryTransaction.create({
        data: {
          variantId,
          type: type as Prisma.InventoryTransactionCreateInput['type'],
          quantity,
          note,
        },
      })

      return { variantId, stock: newStock, reservedStock: variant.reservedStock }
    })
  }

  async bulkUpdateStock(shopId: string, items: { variantId: string; stock: number }[]) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const results: { variantId: string; stock: number }[] = []

      for (const item of items) {
        const variant = await tx.productVariant.findFirst({
          where: { id: item.variantId, product: { shopId, deletedAt: null } },
        })

        if (!variant) continue

        const diff = item.stock - variant.stock

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: item.stock },
        })

        await tx.inventoryTransaction.create({
          data: {
            variantId: item.variantId,
            type: 'ADJUSTMENT',
            quantity: diff,
            note: 'Bulk stock update',
          },
        })

        results.push({ variantId: item.variantId, stock: item.stock })
      }

      return { updated: results.length, items: results }
    })
  }

  async getHistory(shopId: string, variantId: string, page = 1, limit = 20) {
    const variant = await prisma.productVariant.findFirst({
      where: { id: variantId, product: { shopId } },
    })

    if (!variant) {
      throw new BadRequestException('Variant not found')
    }

    const [transactions, total] = await Promise.all([
      prisma.inventoryTransaction.findMany({
        where: { variantId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inventoryTransaction.count({ where: { variantId } }),
    ])

    return { data: transactions, meta: buildPaginationMeta(page, limit, total) }
  }

  async getLowStockAlerts(shopId: string) {
    const variants = await prisma.productVariant.findMany({
      where: {
        product: { shopId, deletedAt: null },
        stock: { lte: LOW_STOCK_THRESHOLD },
      },
      include: {
        product: { select: { id: true, name: true } },
        optionValues: { include: { option: { include: { group: true } } } },
      },
      orderBy: { stock: 'asc' },
      take: 50,
    })

    return variants.map((v: typeof variants[number]) => ({
      variantId: v.id,
      productId: v.product.id,
      productName: v.product.name,
      sku: v.sku,
      stock: v.stock,
      reservedStock: v.reservedStock,
      options: v.optionValues.map((ov: typeof v.optionValues[number]) => ({
        group: ov.option.group.name,
        value: ov.option.value,
      })),
    }))
  }
}
