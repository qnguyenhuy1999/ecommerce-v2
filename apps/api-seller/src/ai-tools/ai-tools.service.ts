import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { CreateAiTaskDto } from './dto/ai-tools.dto'
import { buildPaginationMeta, PaginationDto } from '../common/dto/pagination.dto'

@Injectable()
export class AiToolsService {
  async createTask(shopId: string, dto: CreateAiTaskDto) {
    return prisma.aiTask.create({
      data: {
        shopId,
        type: dto.type as
          | 'DESCRIPTION_GENERATION'
          | 'TITLE_OPTIMIZATION'
          | 'KEYWORD_GENERATION'
          | 'IMAGE_TAGGING'
          | 'CATEGORY_SUGGESTION'
          | 'SEO_OPTIMIZATION'
          | 'TRANSLATION'
          | 'SALES_INSIGHT',
        productId: dto.productId,
        input: dto.input ?? {},
        status: 'QUEUED',
      },
    })
  }

  async getTask(shopId: string, taskId: string) {
    const task = await prisma.aiTask.findFirst({
      where: { id: taskId, shopId },
    })
    if (!task) throw new NotFoundException('AI task not found')
    return task
  }

  async listTasks(shopId: string, query: PaginationDto) {
    const { page = 1, limit = 20 } = query

    const where: Prisma.AiTaskWhereInput = { shopId }

    const [tasks, total] = await Promise.all([
      prisma.aiTask.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.aiTask.count({ where }),
    ])

    return { data: tasks, meta: buildPaginationMeta(page, limit, total) }
  }

  async processTask(taskId: string) {
    const task = await prisma.aiTask.findUnique({ where: { id: taskId } })
    if (!task) throw new NotFoundException('Task not found')

    await prisma.aiTask.update({
      where: { id: taskId },
      data: { status: 'PROCESSING', startedAt: new Date() },
    })

    const output = await this.executeAiTask(task.type, task.input as Record<string, unknown>)

    await prisma.aiTask.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        output,
        completedAt: new Date(),
        tokensUsed: (output._tokensUsed as number) ?? 0,
        cost: (output._cost as number) ?? 0,
      },
    })

    return prisma.aiTask.findUnique({ where: { id: taskId } })
  }

  private async executeAiTask(
    type: string,
    _input: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    switch (type) {
      case 'DESCRIPTION_GENERATION':
        return {
          description: `AI-generated description for product`,
          _tokensUsed: 500,
          _cost: 0.01,
          _provider: 'openai',
          _model: 'gpt-4',
        }
      case 'TITLE_OPTIMIZATION':
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
      case 'KEYWORD_GENERATION':
        return {
          keywords: ['keyword1', 'keyword2', 'keyword3'],
          _tokensUsed: 150,
          _cost: 0.003,
          _provider: 'openai',
          _model: 'gpt-4',
        }
      case 'CATEGORY_SUGGESTION':
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
      prisma.aiTask.count({ where: { shopId } }),
      prisma.aiTask.aggregate({
        where: { shopId },
        _sum: { tokensUsed: true },
      }),
      prisma.aiTask.aggregate({
        where: { shopId },
        _sum: { cost: true },
      }),
    ])

    return {
      totalTasks,
      totalTokens: totalTokens._sum.tokensUsed ?? 0,
      totalCost: Number(totalCost._sum.cost ?? 0),
    }
  }
}
