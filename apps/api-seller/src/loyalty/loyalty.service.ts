import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { CreateLoyaltyTierDto, CreateMissionDto, RedeemPointsDto } from './dto/loyalty.dto'
import { offsetPaginate, buildOffsetResponse, OffsetPaginationDto } from '@ecom/pagination'

@Injectable()
export class LoyaltyService {
  constructor(private readonly prisma: PrismaService) {}
  async listTiers() {
    return this.prisma.loyaltyTier.findMany({ orderBy: { minPoints: 'asc' } })
  }

  async createTier(dto: CreateLoyaltyTierDto) {
    return this.prisma.loyaltyTier.create({
      data: {
        name: dto.name,
        minPoints: dto.minPoints,
        multiplier: dto.pointMultiplier ?? 1,
        benefits: dto.benefits ?? {},
      },
    })
  }

  async getMembership(userId: string) {
    let account = await this.prisma.loyaltyAccount.findUnique({
      where: { userId },
      include: { tier: true },
    })

    if (!account) {
      const defaultTier = await this.prisma.loyaltyTier.findFirst({ orderBy: { minPoints: 'asc' } })
      account = await this.prisma.loyaltyAccount.create({
        data: { userId, tierId: defaultTier?.id },
        include: { tier: true },
      })
    }

    return account
  }

  async earnPoints(
    userId: string,
    points: number,
    type: string,
    referenceId?: string,
    description?: string,
  ) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const account = await tx.loyaltyAccount.upsert({
        where: { userId },
        update: {
          totalPoints: { increment: points },
          availablePoints: { increment: points },
          lifetimePoints: { increment: points },
        },
        create: { userId, totalPoints: points, availablePoints: points, lifetimePoints: points },
      })

      const transaction = await tx.loyaltyTransaction.create({
        data: {
          accountId: account.id,
          type: type as 'EARN' | 'SPEND' | 'EXPIRE' | 'ADJUST' | 'REFUND',
          points,
          balance: account.availablePoints + points,
          referenceId,
          description,
        },
      })

      await this.checkTierUpgrade(tx, account.id)

      return transaction
    })
  }

  async redeemPoints(userId: string, dto: RedeemPointsDto) {
    const account = await this.prisma.loyaltyAccount.findUnique({ where: { userId } })
    if (!account) throw new NotFoundException('Account not found')

    if (account.availablePoints < dto.points) {
      throw new BadRequestException('Insufficient points')
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.loyaltyAccount.update({
        where: { userId },
        data: { availablePoints: { decrement: dto.points } },
      })

      return tx.loyaltyTransaction.create({
        data: {
          accountId: account.id,
          type: 'SPEND',
          points: -dto.points,
          balance: account.availablePoints - dto.points,
          referenceId: dto.orderId,
          description: dto.description ?? 'Points redeemed',
        },
      })
    })
  }

  async dailyCheckIn(userId: string) {
    const membership = await this.getMembership(userId)

    if (membership.lastCheckIn) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const lastCheckIn = new Date(membership.lastCheckIn)
      lastCheckIn.setHours(0, 0, 0, 0)

      if (today.getTime() === lastCheckIn.getTime()) {
        throw new BadRequestException('Already checked in today')
      }

      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const isConsecutive = lastCheckIn.getTime() === yesterday.getTime()

      const streak = isConsecutive ? membership.streak + 1 : 1
      const points = Math.min(10 + (streak - 1) * 2, 50)

      await this.prisma.loyaltyAccount.update({
        where: { userId },
        data: { lastCheckIn: new Date(), streak },
      })

      return this.earnPoints(userId, points, 'EARN', undefined, `Day ${streak} check-in`)
    }

    await this.prisma.loyaltyAccount.update({
      where: { userId },
      data: { lastCheckIn: new Date(), streak: 1 },
    })

    return this.earnPoints(userId, 10, 'EARN', undefined, 'Day 1 check-in')
  }

  async listMissions(query: OffsetPaginationDto) {
    const { page = 1, pageSize = 20 } = query
    const now = new Date()

    const where: Prisma.LoyaltyMissionWhereInput = {
      isActive: true,
      OR: [{ endsAt: null }, { endsAt: { gt: now } }],
    }

    const { items, total } = await offsetPaginate(this.prisma.loyaltyMission, {
      page,
      pageSize,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async createMission(dto: CreateMissionDto) {
    return this.prisma.loyaltyMission.create({
      data: {
        name: dto.name,
        description: dto.description,
        eventType: dto.type,
        rewardPoints: dto.rewardPoints,
        targetCount: dto.targetCount ?? 1,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
    })
  }

  async getTransactionHistory(userId: string, query: OffsetPaginationDto) {
    const { page = 1, pageSize = 20 } = query

    const account = await this.prisma.loyaltyAccount.findUnique({ where: { userId } })
    if (!account) return buildOffsetResponse([], 1, pageSize, 0)

    const where: Prisma.LoyaltyTransactionWhereInput = { accountId: account.id }

    const { items, total } = await offsetPaginate(this.prisma.loyaltyTransaction, {
      page,
      pageSize,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  private async checkTierUpgrade(tx: Prisma.TransactionClient, accountId: string) {
    const account = await tx.loyaltyAccount.findUnique({ where: { id: accountId } })
    if (!account) return

    const tier = await tx.loyaltyTier.findFirst({
      where: { minPoints: { lte: account.totalPoints } },
      orderBy: { minPoints: 'desc' },
    })

    if (tier && tier.id !== account.tierId) {
      await tx.loyaltyAccount.update({
        where: { id: accountId },
        data: { tierId: tier.id },
      })
    }
  }
}
