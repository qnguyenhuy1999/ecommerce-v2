import { Injectable } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { offsetPaginate } from '@ecom/shared/pagination/prisma'

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    where: Prisma.SellerOrderWhereInput,
    options: {
      page: number
      limit: number
      orderBy: Prisma.SellerOrderOrderByWithRelationInput
    },
  ) {
    return offsetPaginate(this.prisma.sellerOrder, {
      page: options.page,
      limit: options.limit,
      where,
      include: {
        order: {
          select: { id: true, shippingName: true, shippingPhone: true, shippingAddress: true },
        },
        items: {
          select: {
            id: true,
            productName: true,
            variantLabel: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
          },
        },
        shipment: { select: { id: true, trackingNumber: true, status: true } },
        _count: { select: { items: true } },
      },
      orderBy: options.orderBy,
    })
  }

  async findOne(where: Prisma.SellerOrderWhereInput) {
    return this.prisma.sellerOrder.findFirst({ where })
  }

  async findOneWithDetails(where: Prisma.SellerOrderWhereInput) {
    return this.prisma.sellerOrder.findFirst({
      where,
      include: {
        order: true,
        items: {
          include: { variant: { include: { product: { select: { id: true, name: true } } } } },
        },
        shipment: { include: { provider: true } },
        auditLogs: { orderBy: { createdAt: 'desc' } },
      },
    })
  }

  async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn)
  }
}
