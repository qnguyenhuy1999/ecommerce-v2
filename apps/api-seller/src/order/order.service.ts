import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { OrderQueryDto } from './dto/order-query.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/pagination'

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PACKING', 'CANCELLED'],
  PACKING: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

@Injectable()
export class OrderService {
  async list(shopId: string, query: OrderQueryDto) {
    const { page = 1, pageSize = 20, sort = 'createdAt', order = 'desc', status, search } = query

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

    const { items, total } = await offsetPaginate(prisma.sellerOrder, {
      page,
      pageSize,
      where,
      include: {
        order: {
          select: { id: true, shippingName: true, shippingPhone: true, shippingAddress: true },
        },
        items: { select: { id: true, productName: true, variantLabel: true, quantity: true, unitPrice: true, totalPrice: true } },
        shipment: { select: { id: true, trackingNumber: true, status: true } },
        _count: { select: { items: true } },
      },
      orderBy: { [sort]: order },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async getById(shopId: string, sellerOrderId: string) {
    const sellerOrder = await prisma.sellerOrder.findFirst({
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
    const sellerOrder = await prisma.sellerOrder.findFirst({
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

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

      if (newStatus === 'CONFIRMED') {
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
              type: 'RESERVATION',
              quantity: item.quantity,
              reference: sellerOrderId,
              note: `Reserved for order ${sellerOrderId}`,
            },
          })
        }
      }

      if (newStatus === 'SHIPPED') {
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
              type: 'STOCK_OUT',
              quantity: item.quantity,
              reference: sellerOrderId,
              note: `Shipped for order ${sellerOrderId}`,
            },
          })
        }
      }

      if (newStatus === 'CANCELLED') {
        if (currentStatus === 'CONFIRMED' || currentStatus === 'PACKING') {
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
                type: 'RESERVATION_RELEASE',
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
