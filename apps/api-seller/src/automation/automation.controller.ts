import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import {
  ApiOkResponseData,
  ApiCreatedResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'
import type { ShopService } from '../shop/shop.service'
import type { AutomationService } from './automation.service'
import type { CreateAutomationRuleDto, UpdateAutomationRuleDto } from './dto/automation.dto'
import type { AutomationQueryDto } from './dto/automation-query.dto'

@ApiTags('Seller/Automation')
@ApiAuth()
@ApiErrorResponses()
@Controller('automations')
@UseGuards(AuthGuard)
export class AutomationController {
  constructor(
    private readonly automationService: AutomationService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  @ApiPaginatedResponse(Object)
  async listRules(@CurrentUser() user: SessionData, @Query() query: AutomationQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.automationService.listRules(shopId, query)
  }

  @Get(':id')
  @ApiOkResponseData(Object)
  async getRule(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.automationService.getRuleById(shopId, id)
  }

  @Post()
  @ApiCreatedResponseData(Object)
  async createRule(@CurrentUser() user: SessionData, @Body() dto: CreateAutomationRuleDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.automationService.createRule(shopId, dto)
  }

  @Put(':id')
  @ApiOkResponseData(Object)
  async updateRule(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() dto: UpdateAutomationRuleDto,
  ) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.automationService.updateRule(shopId, id, dto)
  }

  @Delete(':id')
  @ApiOkResponseData(Object)
  async deleteRule(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.automationService.deleteRule(shopId, id)
  }
}
