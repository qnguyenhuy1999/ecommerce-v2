import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { AiToolsService } from './ai-tools.service'
import { CreateAiTaskDto } from './dto/ai-tools.dto'
import { OffsetPaginationDto } from '@ecom/pagination'

@Controller('ai-tools')
@UseGuards(AuthGuard)
export class AiToolsController {
  constructor(
    private readonly aiToolsService: AiToolsService,
    private readonly shopService: ShopService,
  ) {}

  @Post('tasks')
  async createTask(@CurrentUser() user: SessionData, @Body() dto: CreateAiTaskDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.aiToolsService.createTask(shopId, dto)
  }

  @Get('tasks')
  async listTasks(@CurrentUser() user: SessionData, @Query() query: OffsetPaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.aiToolsService.listTasks(shopId, query)
  }

  @Get('tasks/:id')
  async getTask(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.aiToolsService.getTask(shopId, id)
  }

  @Post('tasks/:id/process')
  async processTask(@Param('id') id: string) {
    return this.aiToolsService.processTask(id)
  }

  @Get('usage')
  async getUsage(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.aiToolsService.getUsageStats(shopId)
  }
}
