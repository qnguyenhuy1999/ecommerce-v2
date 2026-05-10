import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService, type OrderStatus, type InventoryTransactionType, Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { OrderQueryDto } from './dto/order-query.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'

const VALID_TRANSITIONS: Record<string, string[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.PACKING, OrderStatus.CANCELLED],
  [OrderStatus.PACKING]: [OrderStatus.SHIPPED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
}

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  async list(shopId: string, query: OrderQueryDto) {
    const {
      page = PAGINATION_DEFAULTS.DEFAULT_PAGE,
      limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      sortOrder = PAGINATION_DEFAULTS.DEFAULT_SORT_ORDER,
      status,
      search,
    } = query

    const where: Prisma.SellerOrderWhereInput = {
      shopId,
      ...(status ? { status: status as Prisma.SellerOrderWhereInput['status'] } : {}),
      ...(search
        ? {
            OR: [
              { order: { shippingName: { contains: search, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    }

    const { items, total } = await offsetPaginate(this.prisma.sellerOrder, {
      page,
      limit,
      where,
      include: {
        order: {
          select: { id: true, shippingName: true, shippingPhone: true, shippingAddress: true },
        },
        items: { select: { id: true, productName: true, variantLabel: true, quantity: true, unitPrice: true, totalPrice: true } },
        shipment: { select: { id: true, trackingNumber: true, status: true } },
        _count: { select: { items: true } },
      },
      orderBy: { [sortBy]: sortOrder },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async getById(shopId: string, sellerOrderId: string) {
    const sellerOrder = await this.prisma.sellerOrder.findFirst({
      where: { id: sellerOrderId, shopId },
      include: {
        order: true,
        items: {
          include: { variant: { include: { product: { select: { id: true, name: true } } } } },
        },
        shipment: { include: { provider: true } },
        auditLogs: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!sellerOrder) {
      throw new NotFoundException('Order not found')
    }

    return sellerOrder
  }

  async updateStatus(shopId: string, sellerOrderId: string, newStatus: string, note?: string, performedBy?: string) {
    const sellerOrder = await this.prisma.sellerOrder.findFirst({
      where: { id: sellerOrderId, shopId },
    })

    if (!sellerOrder) {
      throw new NotFoundException('Order not found')
    }

    const currentStatus = sellerOrder.status
    const allowed = VALID_TRANSITIONS[currentStatus] ?? []

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}. Allowed: ${allowed.join(', ')}`,
      )
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.sellerOrder.update({
        where: { id: sellerOrderId },
        data: { status: newStatus as Prisma.SellerOrderUpdateInput['status'] },
      })

      await tx.orderAuditLog.create({
        data: {
          sellerOrderId,
          fromStatus: currentStatus,
          toStatus: newStatus,
          note,
          performedBy,
        },
      })

      if (newStatus === OrderStatus.CONFIRMED) {
        const items = await tx.sellerOrderItem.findMany({
          where: { sellerOrderId },
        })

        for (const item of items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              reservedStock: { increment: item.quantity },
            },
          })

          await tx.inventoryTransaction.create({
            data: {
              variantId: item.variantId,
              type: InventoryTransactionType.RESERVATION,
              quantity: item.quantity,
              reference: sellerOrderId,
              note: `Reserved for order ${sellerOrderId}`,
            },
          })
        }
      }

      if (newStatus === OrderStatus.SHIPPED) {
        const items = await tx.sellerOrderItem.findMany({
          where: { sellerOrderId },
        })

        for (const item of items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: { decrement: item.quantity },
              reservedStock: { decrement: item.quantity },
            },
          })

          await tx.inventoryTransaction.create({
            data: {
              variantId: item.variantId,
              type: InventoryTransactionType.STOCK_OUT,
              quantity: item.quantity,
              reference: sellerOrderId,
              note: `Shipped for order ${sellerOrderId}`,
            },
          })
        }
      }

      if (newStatus === OrderStatus.CANCELLED) {
        if (currentStatus === OrderStatus.CONFIRMED || currentStatus === OrderStatus.PACKING) {
          const items = await tx.sellerOrderItem.findMany({
            where: { sellerOrderId },
          })

          for (const item of items) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { reservedStock: { decrement: item.quantity } },
            })

            await tx.inventoryTransaction.create({
              data: {
                variantId: item.variantId,
                type: InventoryTransactionType.RESERVATION_RELEASE,
                quantity: item.quantity,
                reference: sellerOrderId,
                note: `Released: order ${sellerOrderId} cancelled`,
              },
            })
          }
        }
      }

      return updated
    })
  }
}
