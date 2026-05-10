import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { CreatePlanDto, SubscribeDto } from './dto/subscription.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'\nimport { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}
  async listPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      include: { entitlements: true },
      orderBy: { sortOrder: 'asc' },
    })
  }

  async getPlanById(id: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id },
      include: { entitlements: true },
    })
    if (!plan) throw new NotFoundException('Plan not found')
    return plan
  }

  async createPlan(dto: CreatePlanDto) {
    return this.prisma.subscriptionPlan.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        monthlyPrice: dto.monthlyPrice,
        yearlyPrice: dto.yearlyPrice,
        productLimit: dto.productLimit,
        orderLimit: dto.orderLimit,
        storageLimit: dto.storageLimit,
        staffLimit: dto.staffLimit,
      },
    })
  }

  async subscribe(shopId: string, dto: SubscribeDto) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: dto.planId } })
    if (!plan) throw new NotFoundException('Plan not found')

    const existing = await this.prisma.sellerSubscription.findUnique({ where: { shopId } })
    if (existing && existing.status === 'ACTIVE') {
      throw new BadRequestException('Shop already has an active subscription')
    }

    const billingCycle = dto.billingCycle ?? 'monthly'
    const now = new Date()
    const periodEnd = new Date(now)
    if (billingCycle === 'yearly') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const subscription = existing
        ? await tx.sellerSubscription.update({
            where: { shopId },
            data: {
              planId: dto.planId,
              status: 'ACTIVE',
              billingCycle,
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
              cancelledAt: null,
            },
          })
        : await tx.sellerSubscription.create({
            data: {
              shopId,
              planId: dto.planId,
              billingCycle,
              currentPeriodStart: now,
              currentPeriodEnd: periodEnd,
            },
          })

      const amount =
        billingCycle === 'yearly' && plan.yearlyPrice ? plan.yearlyPrice : plan.monthlyPrice

      await tx.subscriptionInvoice.create({
        data: {
          subscriptionId: subscription.id,
          amount,
          status: 'OPEN',
          periodStart: now,
          periodEnd,
        },
      })

      return subscription
    })
  }

  async getSubscription(shopId: string) {
    const subscription = await this.prisma.sellerSubscription.findUnique({
      where: { shopId },
      include: { plan: { include: { entitlements: true } } },
    })

    return subscription
  }

  async cancelSubscription(shopId: string) {
    const subscription = await this.prisma.sellerSubscription.findUnique({ where: { shopId } })
    if (!subscription) throw new NotFoundException('Subscription not found')

    return this.prisma.sellerSubscription.update({
      where: { shopId },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    })
  }

  async checkEntitlement(
    shopId: string,
    feature: string,
  ): Promise<{ allowed: boolean; value?: string }> {
    const subscription = await this.prisma.sellerSubscription.findUnique({
      where: { shopId },
      include: { plan: { include: { entitlements: true } } },
    })

    if (!subscription || subscription.status !== 'ACTIVE') {
      return { allowed: false }
    }

    const entitlement = subscription.plan.entitlements.find((e: { feature: string }) => e.feature === feature)
    return entitlement ? { allowed: true, value: entitlement.value } : { allowed: false }
  }

  async listInvoices(shopId: string, query: OffsetPaginationDto) {
    const { page = 1, pageSize = 20 } = query

    const subscription = await this.prisma.sellerSubscription.findUnique({ where: { shopId } })
    if (!subscription) return buildOffsetResponse([], 1, pageSize, 0)

    const where: Prisma.SubscriptionInvoiceWhereInput = { subscriptionId: subscription.id }

    const { items, total } = await offsetPaginate(this.prisma.subscriptionInvoice, {
      page,
      pageSize,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }
}
