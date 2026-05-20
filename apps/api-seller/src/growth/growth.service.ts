import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import type { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { withDefined } from '@ecom/shared/utils'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { randomBytes } from 'node:crypto'
import type {
  CreateCampaignDto,
  CreateExperimentDto,
  CreateFeatureFlagDto,
  CreateReferralProgramDto,
} from './dto/growth.dto'

@Injectable()
export class GrowthService {
  constructor(private readonly prisma: PrismaService) {}
  // --- Referral Program ---

  listReferralPrograms(query: OffsetPaginationDto) {
    const { limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT } = query
    // ReferralProgram model missing in schema
    return buildOffsetResponse([], 1, limit, 0)
  }

  createReferralProgram(_dto: CreateReferralProgramDto) {
    // ReferralProgram model missing in schema
    throw new BadRequestException('Referral program not implemented in schema')
  }

  async createReferral(_programId: string, referrerId: string) {
    const code = randomBytes(6).toString('hex')

    return this.prisma.referral.create({
      data: {
        referrerId,
        code,
      },
    })
  }

  async completeReferral(code: string, refereeId: string) {
    const referral = await this.prisma.referral.findUnique({
      where: { code },
    })

    if (!referral) throw new NotFoundException('Referral not found')
    if (referral.referrerId === refereeId) {
      throw new BadRequestException('Cannot refer yourself')
    }
    if (referral.status !== 'PENDING') {
      throw new BadRequestException('Referral already used')
    }

    return this.prisma.referral.update({
      where: { code },
      data: {
        refereeId,
        status: 'CONVERTED',
        convertedAt: new Date(),
      },
    })
  }

  // --- Experiments / A/B Testing ---

  async listExperiments(query: OffsetPaginationDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT } = query

    const { items, total } = await offsetPaginate(this.prisma.experiment, {
      page,
      limit: limit,
      include: { variants: true },
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async createExperiment(dto: CreateExperimentDto) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const experiment = await tx.experiment.create({
        data: {
          name: dto.name,
          ...withDefined({ description: dto.description }),
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
    const experiment = await this.prisma.experiment.findUnique({
      where: { id: experimentId },
      include: { variants: true },
    })

    if (!experiment || experiment.status !== 'RUNNING') return null

    const hash = this.hashString(`${experimentId}:${userId}`)
    const bucket = hash % 100

    if (bucket >= experiment.trafficPercent) return null

    let cumWeight = 0
    const totalWeight = experiment.variants.reduce(
      (sum: number, v: { weight: number }) => sum + v.weight,
      0,
    )
    const variantBucket = hash % totalWeight

    let selectedVariant = experiment.variants[0]
    for (const variant of experiment.variants) {
      cumWeight += variant.weight
      if (variantBucket < cumWeight) {
        selectedVariant = variant
        break
      }
    }

    return selectedVariant
  }

  // --- Feature Flags ---

  async listFeatureFlags() {
    return this.prisma.featureFlag.findMany({ orderBy: { key: 'asc' } })
  }

  async createFeatureFlag(dto: CreateFeatureFlagDto) {
    return this.prisma.featureFlag.create({
      data: {
        key: dto.key,
        name: dto.key,
        ...withDefined({ description: dto.description }),
        isEnabled: dto.isEnabled ?? false,
        targetRules: (dto.rules ?? {}) as Prisma.InputJsonValue,
      },
    })
  }

  async toggleFeatureFlag(key: string, isEnabled: boolean) {
    return this.prisma.featureFlag.update({
      where: { key },
      data: { isEnabled },
    })
  }

  async isFeatureEnabled(key: string, _context?: Record<string, unknown>): Promise<boolean> {
    const flag = await this.prisma.featureFlag.findUnique({ where: { key } })
    if (!flag) return false
    return flag.isEnabled
  }

  // --- Growth Campaigns ---

  async listCampaigns(query: OffsetPaginationDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT } = query

    const { items, total } = await offsetPaginate(this.prisma.growthCampaign, {
      page,
      limit: limit,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async createCampaign(dto: CreateCampaignDto) {
    const data: Prisma.GrowthCampaignCreateInput = {
      name: dto.name,
      type: dto.type,
      config: (dto.config ?? {}) as Prisma.InputJsonValue,
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

    return this.prisma.growthCampaign.create({
      data,
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
