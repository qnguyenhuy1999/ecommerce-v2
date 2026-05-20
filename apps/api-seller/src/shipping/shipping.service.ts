import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '@ecom/database'

@Injectable()
export class ShippingService {
  constructor(private readonly prisma: PrismaService) {}
  async listProviders() {
    return this.prisma.shippingProvider.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
  }

  async getSellerMethods(shopId: string) {
    return this.prisma.sellerShippingMethod.findMany({
      where: { shopId },
      include: { provider: true },
    })
  }

  async toggleMethod(shopId: string, providerId: string, isEnabled: boolean) {
    const provider = await this.prisma.shippingProvider.findUnique({ where: { id: providerId } })
    if (!provider) {
      throw new NotFoundException('Shipping provider not found')
    }

    return this.prisma.sellerShippingMethod.upsert({
      where: { shopId_providerId: { shopId, providerId } },
      update: { isEnabled },
      create: { shopId, providerId, isEnabled },
      include: { provider: true },
    })
  }

  async createShipment(
    shopId: string,
    sellerOrderId: string,
    providerId: string,
    trackingNumber?: string,
  ) {
    const sellerOrder = await this.prisma.sellerOrder.findFirst({
      where: { id: sellerOrderId, shopId },
      include: { shipments: true },
    })

    if (!sellerOrder) {
      throw new NotFoundException('Order not found')
    }

    if (sellerOrder.shipments.length > 0) {
      throw new BadRequestException('Shipment already exists for this order')
    }

    if (sellerOrder.status !== 'PACKING' && sellerOrder.status !== 'CONFIRMED') {
      throw new BadRequestException(
        'Order must be in CONFIRMED or PACKING status to create shipment',
      )
    }

    const data: {
      sellerOrderId: string
      providerId: string
      trackingNumber?: string | null
    } = {
      sellerOrderId,
      providerId,
    }

    if (trackingNumber !== undefined) {
      data.trackingNumber = trackingNumber
    }

    return this.prisma.shipment.create({
      data,
      include: { provider: true },
    })
  }

  async updateTracking(shopId: string, shipmentId: string, trackingNumber: string) {
    const shipment = await this.prisma.shipment.findFirst({
      where: { id: shipmentId, sellerOrder: { shopId } },
    })

    if (!shipment) {
      throw new NotFoundException('Shipment not found')
    }

    return this.prisma.shipment.update({
      where: { id: shipmentId },
      data: { trackingNumber },
      include: { provider: true },
    })
  }
}
