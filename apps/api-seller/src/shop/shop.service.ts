import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@ecom/database'
import { UpdateShopDto } from './dto/update-shop.dto'

@Injectable()
export class ShopService {
  async getShop(userId: string) {
    const profile = await prisma.sellerProfile.findUnique({
      where: { userId },
      include: { shop: true },
    })

    if (!profile?.shop) {
      throw new NotFoundException('Shop not found. Please complete registration.')
    }

    return profile.shop
  }

  async updateShop(userId: string, dto: UpdateShopDto) {
    const profile = await prisma.sellerProfile.findUnique({
      where: { userId },
      include: { shop: true },
    })

    if (!profile?.shop) {
      throw new NotFoundException('Shop not found')
    }

    return prisma.shop.update({
      where: { id: profile.shop.id },
      data: dto,
    })
  }

  async getShopId(userId: string): Promise<string> {
    const profile = await prisma.sellerProfile.findUnique({
      where: { userId },
      include: { shop: { select: { id: true } } },
    })

    if (!profile?.shop) {
      throw new NotFoundException('Shop not found')
    }

    return profile.shop.id
  }
}
