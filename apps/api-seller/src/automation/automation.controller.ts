import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { AutomationService } from './automation.service'
import { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto'
import { PaginationDto } from '../common/dto/pagination.dto'

@Controller('automations')
@UseGuards(AuthGuard)
export class AutomationController {
  constructor(
    private readonly automationService: AutomationService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  async listRules(@CurrentUser() user: SessionData, @Query() query: PaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.automationService.listRules(shopId, query)
  }

  @Get(':id')
  async getRule(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.automationService.getRuleById(shopId, id)
  }

  @Post()
  async createRule(@CurrentUser() user: SessionData, @Body() dto: CreateAutomationRuleDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.automationService.createRule(shopId, dto)
  }

  @Put(':id')
  async updateRule(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() dto: UpdateAutomationRuleDto,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.automationService.updateRule(shopId, id, dto)
  }

  @Delete(':id')
  async deleteRule(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.automationService.deleteRule(shopId, id)
  }
}
