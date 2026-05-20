import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import type { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { withDefined } from '@ecom/shared/utils'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { CreateLoyaltyTierDto, CreateMissionDto, RedeemPointsDto } from './dto/loyalty.dto'

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
        benefits: (dto.benefits ?? {}) as Prisma.InputJsonValue,
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
      const createData = defaultTier
        ? { userId, tier: { connect: { id: defaultTier.id } } }
        : { userId }

      account = await this.prisma.loyaltyAccount.create({
        data: createData,
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

      const transactionData: Prisma.LoyaltyTransactionUncheckedCreateInput = {
        accountId: account.id,
        type: type as 'EARN' | 'SPEND' | 'EXPIRE' | 'ADJUST' | 'REFUND',
        points,
        balance: account.availablePoints + points,
      }

      if (referenceId !== undefined) {
        transactionData.referenceId = referenceId
      }

      if (description !== undefined) {
        transactionData.description = description
      }

      const transaction = await tx.loyaltyTransaction.create({ data: transactionData })

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
          ...withDefined({ referenceId: dto.orderId }),
          description: dto.description ?? 'Points redeemed',
        },
      })
    })
  }

  async dailyCheckIn(userId: string) {
    const membership = await this.getMembership(userId)
    // getMembership always creates if not found, so membership is never null here
    if (!membership) throw new BadRequestException('Could not get or create loyalty account')

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
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT } = query
    const now = new Date()

    const where: Prisma.LoyaltyMissionWhereInput = {
      isActive: true,
      OR: [{ endsAt: null }, { endsAt: { gt: now } }],
    }

    const { items, total } = await offsetPaginate(this.prisma.loyaltyMission, {
      page,
      limit,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async createMission(dto: CreateMissionDto) {
    const data: Prisma.LoyaltyMissionCreateInput = {
      name: dto.name,
      eventType: dto.type,
      rewardPoints: dto.rewardPoints,
      targetCount: dto.targetCount ?? 1,
    }

    if (dto.description !== undefined) {
      data.description = dto.description
    }

    if (dto.startsAt !== undefined) {
      data.startsAt = new Date(dto.startsAt)
    }

    if (dto.endsAt !== undefined) {
      data.endsAt = new Date(dto.endsAt)
    }

    return this.prisma.loyaltyMission.create({
      data,
    })
  }

  async getTransactionHistory(userId: string, query: OffsetPaginationDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT } = query

    const account = await this.prisma.loyaltyAccount.findUnique({ where: { userId } })
    if (!account) return buildOffsetResponse([], 1, limit, 0)

    const where: Prisma.LoyaltyTransactionWhereInput = { accountId: account.id }

    const { items, total } = await offsetPaginate(this.prisma.loyaltyTransaction, {
      page,
      limit,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
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
