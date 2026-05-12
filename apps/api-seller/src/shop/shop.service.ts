import { Injectable, NotFoundException } from '@nestjs/common'
import type { PrismaService } from '@ecom/database'
import type { UpdateShopDto } from './dto/update-shop.dto'

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}
  async getShop(userId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
      include: { shop: true },
    })

    if (!profile?.shop) {
      throw new NotFoundException('Shop not found. Please complete registration.')
    }

    return profile.shop
  }

  async updateShop(userId: string, dto: UpdateShopDto) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
      include: { shop: true },
    })

    if (!profile?.shop) {
      throw new NotFoundException('Shop not found')
    }

    return this.prisma.shop.update({
      where: { id: profile.shop.id },
      data: dto,
    })
  }

  async getShopId(userId: string): Promise<string> {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
      include: { shop: { select: { id: true } } },
    })

    if (!profile?.shop) {
      throw new NotFoundException('Shop not found')
    }

    return profile.shop.id
  }
}
