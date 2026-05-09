import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto'
import { AutomationQueryDto } from './dto/automation-query.dto'
import { offsetPaginate, buildOffsetResponse } from '@ecom/pagination'

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
      include: { _count: { select: { logs: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, pageSize, total)
  }

  async getRuleById(shopId: string, id: string) {
    const rule = await this.prisma.automationRule.findFirst({
      where: { id, shopId },
      include: {
        logs: { orderBy: { executedAt: 'desc' }, take: 20 },
        _count: { select: { logs: true } },
      },
    })

    if (!rule) throw new NotFoundException('Automation rule not found')
    return rule
  }

  async createRule(shopId: string, dto: CreateAutomationRuleDto) {
    return this.prisma.automationRule.create({
      data: {
        shopId,
        name: dto.name,
        description: dto.description,
        trigger: dto.trigger as
          | 'ORDER_CREATED'
          | 'ORDER_CANCELLED'
          | 'LOW_STOCK'
          | 'NEW_REVIEW'
          | 'NEW_CHAT'
          | 'PRICE_CHANGE'
          | 'SCHEDULE',
        action: dto.action as
          | 'SEND_NOTIFICATION'
          | 'UPDATE_PRICE'
          | 'UPDATE_STOCK'
          | 'AUTO_REPLY'
          | 'CANCEL_ORDER'
          | 'TAG_ORDER'
          | 'WEBHOOK',
        conditions: dto.conditions ?? {},
        actionConfig: dto.actionConfig ?? {},
        isActive: dto.isActive ?? false,
        schedule: dto.schedule,
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
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.conditions && { conditions: dto.conditions }),
        ...(dto.actionConfig && { actionConfig: dto.actionConfig }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.schedule !== undefined && { schedule: dto.schedule }),
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
    if (!rule || !rule.isActive) return null

    const startTime = Date.now()
    let success = true
    let error: string | undefined

    try {
      await this.performAction(
        rule.action,
        rule.actionConfig as Record<string, unknown>,
        triggerData,
      )
    } catch (err) {
      success = false
      error = err instanceof Error ? err.message : 'Unknown error'
    }

    const duration = Date.now() - startTime

    await this.prisma.$transaction([
      this.prisma.automationLog.create({
        data: {
          ruleId,
          triggerData,
          result: success ? { status: 'success' } : { status: 'error', error },
          success,
          duration,
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
  ): Promise<void> {
    switch (action) {
      case 'SEND_NOTIFICATION':
        break
      case 'AUTO_REPLY':
        break
      case 'UPDATE_PRICE':
        break
      case 'UPDATE_STOCK':
        break
      case 'CANCEL_ORDER':
        break
      case 'TAG_ORDER':
        break
      case 'WEBHOOK':
        break
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  }
}
