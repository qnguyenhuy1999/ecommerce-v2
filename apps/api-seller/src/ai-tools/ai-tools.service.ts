import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import type { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { buildOffsetResponse, offsetPaginate } from '@ecom/shared/pagination/prisma'
import { withDefined } from '@ecom/shared/utils'
import { Injectable, NotFoundException } from '@nestjs/common'
import type { CreateAiTaskDto } from './dto/ai-tools.dto'

@Injectable()
export class AiToolsService {
  constructor(private readonly prisma: PrismaService) {}
  async createTask(shopId: string, dto: CreateAiTaskDto) {
    return this.prisma.aiTask.create({
      data: {
        shopId,
        // AiTaskType enum: DESCRIPTION, TITLE, KEYWORDS, IMAGE_TAG, CATEGORY_SUGGEST, SEO, TRANSLATION, SALES_INSIGHT
        type: dto.type as
          | 'DESCRIPTION'
          | 'TITLE'
          | 'KEYWORDS'
          | 'IMAGE_TAG'
          | 'CATEGORY_SUGGEST'
          | 'SEO'
          | 'TRANSLATION'
          | 'SALES_INSIGHT',
        ...withDefined({ productId: dto.productId }),
        inputData: (dto.input ?? {}) as Prisma.InputJsonValue,
        status: 'QUEUED',
      },
    })
  }

  async getTask(shopId: string, taskId: string) {
    const task = await this.prisma.aiTask.findFirst({
      where: { id: taskId, shopId },
    })
    if (!task) throw new NotFoundException('AI task not found')
    return task
  }

  async listTasks(shopId: string, query: OffsetPaginationDto) {
    const { page = 1, limit = PAGINATION_DEFAULTS.DEFAULT_LIMIT } = query

    const where: Prisma.AiTaskWhereInput = { shopId }

    const { items, total } = await offsetPaginate(this.prisma.aiTask, {
      page,
      limit,
      where,
      orderBy: { createdAt: 'desc' },
    })

    return buildOffsetResponse(items, page, limit, total)
  }

  async processTask(taskId: string) {
    const task = await this.prisma.aiTask.findUnique({ where: { id: taskId } })
    if (!task) throw new NotFoundException('Task not found')

    await this.prisma.aiTask.update({
      where: { id: taskId },
      data: { status: 'PROCESSING', startedAt: new Date() },
    })

    const output = this.executeAiTask(task.type, task.inputData as Record<string, unknown>)

    await this.prisma.aiTask.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        outputData: output as Prisma.InputJsonValue,
        completedAt: new Date(),
        tokensUsed: (output._tokensUsed as number) ?? 0,
        costUsd: (output._cost as number) ?? 0,
      },
    })

    return this.prisma.aiTask.findUnique({ where: { id: taskId } })
  }

  private executeAiTask(type: string, _input: Record<string, unknown>): Record<string, unknown> {
    switch (type) {
      case 'DESCRIPTION':
        return {
          description: `AI-generated description for product`,
          _tokensUsed: 500,
          _cost: 0.01,
          _provider: 'openai',
          _model: 'gpt-4',
        }
      case 'TITLE':
        return {
          suggestions: [
            'Optimized Title Variant A',
            'Optimized Title Variant B',
            'Optimized Title Variant C',
          ],
          _tokensUsed: 200,
          _cost: 0.005,
          _provider: 'openai',
          _model: 'gpt-4',
        }
      case 'KEYWORDS':
        return {
          keywords: ['keyword1', 'keyword2', 'keyword3'],
          _tokensUsed: 150,
          _cost: 0.003,
          _provider: 'openai',
          _model: 'gpt-4',
        }
      case 'CATEGORY_SUGGEST':
        return {
          suggestions: [
            { category: 'Electronics', confidence: 0.95 },
            { category: 'Gadgets', confidence: 0.85 },
          ],
          _tokensUsed: 100,
          _cost: 0.002,
          _provider: 'openai',
          _model: 'gpt-4',
        }
      default:
        return {
          result: `Processed ${type} task`,
          _tokensUsed: 100,
          _cost: 0.002,
          _provider: 'openai',
          _model: 'gpt-4',
        }
    }
  }

  async getUsageStats(shopId: string) {
    const [totalTasks, totalTokens, totalCost] = await Promise.all([
      this.prisma.aiTask.count({ where: { shopId } }),
      this.prisma.aiTask.aggregate({
        where: { shopId },
        _sum: { tokensUsed: true },
      }),
      this.prisma.aiTask.aggregate({
        where: { shopId },
        _sum: { costUsd: true },
      }),
    ])

    return {
      totalTasks,
      totalTokens: totalTokens._sum.tokensUsed ?? 0,
      totalCost: Number(totalCost._sum.costUsd ?? 0),
    }
  }
}
