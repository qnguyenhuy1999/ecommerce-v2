import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { Injectable, NotFoundException } from '@nestjs/common'
import type { AutomationQueryDto } from './dto/automation-query.dto'
import type { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto'

@Injectable()
export class AutomationService {
  constructor(private readonly prisma: PrismaService) {}

  async listRules(shopId: string, query: AutomationQueryDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT } = query

    const where: Prisma.AutomationRuleWhereInput = { shopId }

    const { items, total } = await offsetPaginate(this.prisma.automationRule, {
      page,
      limit,
      where,
      include: { _count: { select: { executions: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async getRuleById(shopId: string, id: string) {
    const rule = await this.prisma.automationRule.findFirst({
      where: { id, shopId },
      include: {
        actions: { orderBy: { sortOrder: 'asc' } },
        executions: { orderBy: { executedAt: 'desc' }, take: 20 },
        _count: { select: { executions: true } },
      },
    })

    if (!rule) throw new NotFoundException('Automation rule not found')
    return rule
  }

  async createRule(shopId: string, dto: CreateAutomationRuleDto) {
    const action = this.resolveActionPayload(dto.action, dto.actionConfig)

    return this.prisma.automationRule.create({
      data: {
        shopId,
        name: dto.name,
        trigger: this.normalizeTrigger(dto.trigger),
        conditions: (dto.conditions ?? {}) as Prisma.InputJsonValue,
        actions: {
          create: [
            {
              action: action.action,
              params: action.params as Prisma.InputJsonValue,
              sortOrder: 0,
            },
          ],
        },
        status: dto.isActive ? 'ACTIVE' : 'DRAFT',
      },
      include: {
        actions: { orderBy: { sortOrder: 'asc' } },
      },
    })
  }

  async updateRule(shopId: string, id: string, dto: UpdateAutomationRuleDto) {
    const rule = await this.prisma.automationRule.findFirst({
      where: { id, shopId },
      include: { actions: { orderBy: { sortOrder: 'asc' } } },
    })
    if (!rule) throw new NotFoundException('Rule not found')

    const actionUpdate =
      dto.actionConfig !== undefined
        ? (() => {
            const currentAction = rule.actions[0]?.action
            const nextAction = this.resolveActionPayload(currentAction, dto.actionConfig)
            return {
              actions: {
                deleteMany: {},
                create: [
                  {
                    action: nextAction.action,
                    params: nextAction.params as Prisma.InputJsonValue,
                    sortOrder: 0,
                  },
                ],
              },
            }
          })()
        : {}

    return this.prisma.automationRule.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.conditions && { conditions: dto.conditions as Prisma.InputJsonValue }),
        ...actionUpdate,
        ...(dto.isActive !== undefined && { status: dto.isActive ? 'ACTIVE' : 'PAUSED' }),
        ...(dto.schedule !== undefined && {
          conditions: {
            ...(rule.conditions as object),
            schedule: dto.schedule,
          },
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
    const rule = await this.prisma.automationRule.findUnique({
      where: { id: ruleId },
      include: { actions: { orderBy: { sortOrder: 'asc' } } },
    })
    if (!rule || rule.status !== 'ACTIVE') return null

    const startTime = Date.now()
    let success = true
    let error: string | undefined
    let actionResults: Record<string, unknown> = {}

    try {
      const primaryAction = rule.actions[0]
      const legacyActions = (rule as unknown as { actionsLegacy?: unknown }).actionsLegacy
      const actions = primaryAction
        ? { type: primaryAction.action, config: primaryAction.params ?? {} }
        : ((legacyActions ?? {}) as Record<string, unknown>)

      actionResults = this.performAction(
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

  private performAction(
    action: string,
    _config: Record<string, unknown>,
    _triggerData: Record<string, unknown>,
  ): Record<string, unknown> {
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

  private normalizeTrigger(trigger: string) {
    switch (trigger) {
      case 'NEW_CHAT':
        return 'MESSAGE_RECEIVED' as const
      case 'NEW_REVIEW':
        return 'REVIEW_RECEIVED' as const
      default:
        return trigger as
          | 'ORDER_CREATED'
          | 'ORDER_CANCELLED'
          | 'LOW_STOCK'
          | 'MESSAGE_RECEIVED'
          | 'REVIEW_RECEIVED'
          | 'SCHEDULE'
          | 'PRICE_CHANGE'
          | 'PRODUCT_PUBLISHED'
    }
  }

  private normalizeAction(action: string) {
    switch (action) {
      case 'AUTO_REPLY':
        return 'SEND_MESSAGE' as const
      case 'WEBHOOK':
        return 'SEND_NOTIFICATION' as const
      default:
        return action as
          | 'SEND_MESSAGE'
          | 'UPDATE_PRICE'
          | 'UPDATE_STOCK'
          | 'CANCEL_ORDER'
          | 'SEND_NOTIFICATION'
          | 'APPLY_COUPON'
          | 'TAG_ORDER'
    }
  }

  private resolveActionPayload(
    action: string | undefined,
    actionConfig: Record<string, unknown> | undefined,
  ) {
    const actionRecord = actionConfig ?? {}
    const actionType =
      typeof actionRecord.type === 'string'
        ? actionRecord.type
        : typeof actionRecord.action === 'string'
          ? actionRecord.action
          : action

    if (!actionType) {
      throw new NotFoundException('Automation action is required')
    }

    const params =
      actionRecord.config &&
      typeof actionRecord.config === 'object' &&
      !Array.isArray(actionRecord.config)
        ? (actionRecord.config as Record<string, unknown>)
        : actionRecord

    return {
      action: this.normalizeAction(actionType),
      params,
    }
  }
}
