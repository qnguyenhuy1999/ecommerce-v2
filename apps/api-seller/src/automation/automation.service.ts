import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto'
import { AutomationQueryDto } from './dto/automation-query.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/shared/pagination/prisma'

@Injectable()
export class AutomationService {
  constructor(private readonly prisma: PrismaService) {}
  async listRules(shopId: string, query: AutomationQueryDto) {
    const { page = 1, pageSize = 20 } = query

    const where: Prisma.AutomationRuleWhereInput = { shopId }

    const { items, total } = await offsetPaginate(this.prisma.automationRule, {
      page,
      pageSize,
      where,
      include: { _count: { select: { executions: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async getRuleById(shopId: string, id: string) {
    const rule = await this.prisma.automationRule.findFirst({
      where: { id, shopId },
      include: {
        executions: { orderBy: { executedAt: 'desc' }, take: 20 },
        _count: { select: { executions: true } },
      },
    })

    if (!rule) throw new NotFoundException('Automation rule not found')
    return rule
  }

  async createRule(shopId: string, dto: CreateAutomationRuleDto) {
    // AutomationTrigger: ORDER_CREATED | ORDER_CANCELLED | LOW_STOCK | MESSAGE_RECEIVED | REVIEW_RECEIVED | SCHEDULE | PRICE_CHANGE | PRODUCT_PUBLISHED
    // AutomationAction (stored in actions Json): SEND_MESSAGE | UPDATE_PRICE | UPDATE_STOCK | CANCEL_ORDER | SEND_NOTIFICATION | APPLY_COUPON | TAG_ORDER
    return this.prisma.automationRule.create({
      data: {
        shopId,
        name: dto.name,
        trigger: dto.trigger as
          | 'ORDER_CREATED'
          | 'ORDER_CANCELLED'
          | 'LOW_STOCK'
          | 'MESSAGE_RECEIVED'
          | 'REVIEW_RECEIVED'
          | 'SCHEDULE'
          | 'PRICE_CHANGE'
          | 'PRODUCT_PUBLISHED',
        conditions: (dto.conditions ?? {}) as Prisma.InputJsonValue,
        actions: (dto.actionConfig ?? { type: dto.action, config: {} }) as Prisma.InputJsonValue,
        status: dto.isActive ? 'ACTIVE' : 'DRAFT',
      },
    })
  }

  async updateRule(shopId: string, id: string, dto: UpdateAutomationRuleDto) {
    const rule = await this.prisma.automationRule.findFirst({ where: { id, shopId } })
    if (!rule) throw new NotFoundException('Rule not found')

    return this.prisma.automationRule.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.conditions && { conditions: dto.conditions as Prisma.InputJsonValue }),
        ...(dto.actionConfig && { actions: dto.actionConfig as Prisma.InputJsonValue }),
        ...(dto.isActive !== undefined && { status: dto.isActive ? 'ACTIVE' : 'PAUSED' }),
        ...(dto.schedule !== undefined && {
          conditions: {
            ...(rule.conditions as object),
            schedule: dto.schedule,
          } as Prisma.InputJsonValue,
        }),
      },
    })
  }

  async deleteRule(shopId: string, id: string) {
    const rule = await this.prisma.automationRule.findFirst({ where: { id, shopId } })
    if (!rule) throw new NotFoundException('Rule not found')

    await this.prisma.automationRule.delete({ where: { id } })
    return { deleted: true }
  }

  async executeRule(ruleId: string, triggerData: Record<string, unknown>) {
    const rule = await this.prisma.automationRule.findUnique({ where: { id: ruleId } })
    if (!rule || rule.status !== 'ACTIVE') return null

    const startTime = Date.now()
    let success = true
    let error: string | undefined
    let actionResults: Record<string, unknown> = {}

    try {
      const actions = rule.actions as Record<string, unknown>
      actionResults = await this.performAction(
        (actions.type as string) ?? '',
        (actions.config as Record<string, unknown>) ?? {},
        triggerData,
      )
    } catch (err) {
      success = false
      error = err instanceof Error ? err.message : 'Unknown error'
    }

    const duration = Date.now() - startTime

    await this.prisma.$transaction([
      this.prisma.automationExecution.create({
        data: {
          ruleId,
          triggerData: triggerData as Prisma.InputJsonValue,
          actionResults: (success ? actionResults : { error }) as Prisma.InputJsonValue,
          success,
        },
      }),
      this.prisma.automationRule.update({
        where: { id: ruleId },
        data: {
          executionCount: { increment: 1 },
          lastExecutedAt: new Date(),
        },
      }),
    ])

    return { success, duration, error }
  }

  private async performAction(
    action: string,
    _config: Record<string, unknown>,
    _triggerData: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    switch (action) {
      case 'SEND_NOTIFICATION':
      case 'SEND_MESSAGE':
      case 'UPDATE_PRICE':
      case 'UPDATE_STOCK':
      case 'CANCEL_ORDER':
      case 'TAG_ORDER':
      case 'APPLY_COUPON':
        return { status: 'executed', action }
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }
}
