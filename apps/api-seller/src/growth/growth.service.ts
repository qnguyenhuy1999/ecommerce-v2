import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import {
  CreateReferralProgramDto,
  CreateExperimentDto,
  CreateFeatureFlagDto,
  CreateCampaignDto,
} from './dto/growth.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { randomBytes } from 'node:crypto'

@Injectable()
export class GrowthService {
  constructor(private readonly prisma: PrismaService) {}
  // --- Referral Program ---

  async listReferralPrograms(query: OffsetPaginationDto) {
    const { limit = 20 } = query
    // ReferralProgram model missing in schema
    return buildOffsetResponse([], 1, limit, 0)
  }

  async createReferralProgram(_dto: CreateReferralProgramDto) {
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
    const { page = 1, limit = 20 } = query

    const { items, total } = await offsetPaginate(this.prisma.experiment, {
      page,
      pageSize: limit,
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
          ...(dto.description !== undefined ? { description: dto.description } : {}),
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
        ...(dto.description !== undefined ? { description: dto.description } : {}),
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
    const { page = 1, limit = 20 } = query

    const { items, total } = await offsetPaginate(this.prisma.growthCampaign, {
      page,
      pageSize: limit,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async createCampaign(dto: CreateCampaignDto) {
    return this.prisma.growthCampaign.create({
      data: {
        name: dto.name,
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        type: dto.type,
        config: (dto.config ?? {}) as Prisma.InputJsonValue,
        ...(dto.startsAt !== undefined ? { startsAt: new Date(dto.startsAt) } : {}),
        ...(dto.endsAt !== undefined ? { endsAt: new Date(dto.endsAt) } : {}),
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
