import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import {
  CreateReferralProgramDto,
  CreateExperimentDto,
  CreateFeatureFlagDto,
  CreateCampaignDto,
} from './dto/growth.dto'
import { buildPaginationMeta, PaginationDto } from '../common/dto/pagination.dto'
import { randomBytes } from 'crypto'

@Injectable()
export class GrowthService {
  // --- Referral Program ---

  async listReferralPrograms(query: PaginationDto) {
    const { page = 1, limit = 20 } = query

    const [programs, total] = await Promise.all([
      prisma.referralProgram.findMany({
        where: { isActive: true },
        include: { _count: { select: { referrals: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.referralProgram.count({ where: { isActive: true } }),
    ])

    return { data: programs, meta: buildPaginationMeta(page, limit, total) }
  }

  async createReferralProgram(dto: CreateReferralProgramDto) {
    return prisma.referralProgram.create({
      data: {
        name: dto.name,
        description: dto.description,
        referrerReward: dto.referrerReward,
        refereeReward: dto.refereeReward,
        rewardType: dto.rewardType ?? 'points',
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
    })
  }

  async createReferral(programId: string, referrerId: string) {
    const program = await prisma.referralProgram.findUnique({ where: { id: programId } })
    if (!program) throw new NotFoundException('Referral program not found')

    const code = randomBytes(6).toString('hex')

    return prisma.referral.create({
      data: {
        programId,
        referrerId,
        code,
      },
    })
  }

  async completeReferral(code: string, refereeId: string) {
    const referral = await prisma.referral.findUnique({
      where: { code },
      include: { program: true },
    })

    if (!referral) throw new NotFoundException('Referral not found')
    if (referral.referrerId === refereeId) {
      throw new BadRequestException('Cannot refer yourself')
    }
    if (referral.status !== 'PENDING') {
      throw new BadRequestException('Referral already used')
    }

    return prisma.referral.update({
      where: { code },
      data: {
        refereeId,
        status: 'COMPLETED',
        completedAt: new Date(),
        referrerReward: referral.program.referrerReward,
        refereeReward: referral.program.refereeReward,
      },
    })
  }

  // --- Experiments / A/B Testing ---

  async listExperiments(query: PaginationDto) {
    const { page = 1, limit = 20 } = query

    const [experiments, total] = await Promise.all([
      prisma.experiment.findMany({
        include: { variants: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.experiment.count(),
    ])

    return { data: experiments, meta: buildPaginationMeta(page, limit, total) }
  }

  async createExperiment(dto: CreateExperimentDto) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const experiment = await tx.experiment.create({
        data: {
          name: dto.name,
          description: dto.description,
          trafficPercent: dto.trafficPercentage ?? 100,
        },
      })

      const variants = dto.variants ?? [
        { name: 'control', weight: 50 },
        { name: 'treatment', weight: 50 },
      ]

      await tx.experimentVariant.createMany({
        data: variants.map((v) => ({
          experimentId: experiment.id,
          name: v.name,
          weight: v.weight,
          config: (v.config ?? {}) as Prisma.InputJsonValue,
        })),
      })

      return tx.experiment.findUnique({
        where: { id: experiment.id },
        include: { variants: true },
      })
    })
  }

  async getExperimentVariant(experimentId: string, userId: string) {
    const experiment = await prisma.experiment.findUnique({
      where: { id: experimentId },
      include: { variants: true },
    })

    if (!experiment || experiment.status !== 'RUNNING') return null

    const assignment = await prisma.experimentAssignment.findUnique({
      where: { experimentId_userId: { experimentId, userId } },
    })

    if (assignment) {
      return experiment.variants.find((v: { id: string }) => v.id === assignment.variantId)
    }

    const hash = this.hashString(`${experimentId}:${userId}`)
    const bucket = hash % 100

    if (bucket >= experiment.trafficPercent) return null

    let cumWeight = 0
    const totalWeight = experiment.variants.reduce((sum: number, v: { weight: number }) => sum + v.weight, 0)
    const variantBucket = hash % totalWeight

    let selectedVariant = experiment.variants[0]
    for (const variant of experiment.variants) {
      cumWeight += variant.weight
      if (variantBucket < cumWeight) {
        selectedVariant = variant
        break
      }
    }

    await prisma.experimentAssignment.create({
      data: { experimentId, userId, variantId: selectedVariant.id },
    })

    return selectedVariant
  }

  // --- Feature Flags ---

  async listFeatureFlags() {
    return prisma.featureFlag.findMany({ orderBy: { key: 'asc' } })
  }

  async createFeatureFlag(dto: CreateFeatureFlagDto) {
    return prisma.featureFlag.create({
      data: {
        key: dto.key,
        description: dto.description,
        isEnabled: dto.isEnabled ?? false,
        rules: dto.rules ?? {},
      },
    })
  }

  async toggleFeatureFlag(key: string, isEnabled: boolean) {
    return prisma.featureFlag.update({
      where: { key },
      data: { isEnabled },
    })
  }

  async isFeatureEnabled(key: string, _context?: Record<string, unknown>): Promise<boolean> {
    const flag = await prisma.featureFlag.findUnique({ where: { key } })
    if (!flag) return false
    return flag.isEnabled
  }

  // --- Growth Campaigns ---

  async listCampaigns(query: PaginationDto) {
    const { page = 1, limit = 20 } = query

    const [campaigns, total] = await Promise.all([
      prisma.growthCampaign.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.growthCampaign.count(),
    ])

    return { data: campaigns, meta: buildPaginationMeta(page, limit, total) }
  }

  async createCampaign(dto: CreateCampaignDto) {
    return prisma.growthCampaign.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        config: dto.config ?? {},
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
    })
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }
}
