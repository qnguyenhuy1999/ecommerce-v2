import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { GrowthService } from './growth.service'
import {
  CreateReferralProgramDto,
  CreateExperimentDto,
  CreateFeatureFlagDto,
  CreateCampaignDto,
} from './dto/growth.dto'
import { OffsetPaginationDto } from '@ecom/pagination'

@Controller('growth')
@UseGuards(AuthGuard)
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Get('referrals')
  async listReferralPrograms(@Query() query: OffsetPaginationDto) {
    return this.growthService.listReferralPrograms(query)
  }

  @Post('referrals/programs')
  async createReferralProgram(@Body() dto: CreateReferralProgramDto) {
    return this.growthService.createReferralProgram(dto)
  }

  @Post('referrals/create')
  async createReferral(@CurrentUser() user: SessionData, @Body() body: { programId: string }) {
    return this.growthService.createReferral(body.programId, user.userId)
  }

  @Get('experiments')
  async listExperiments(@Query() query: OffsetPaginationDto) {
    return this.growthService.listExperiments(query)
  }

  @Post('experiments')
  async createExperiment(@Body() dto: CreateExperimentDto) {
    return this.growthService.createExperiment(dto)
  }

  @Get('experiments/:id/variant')
  async getVariant(@CurrentUser() user: SessionData, @Param('id') id: string) {
    return this.growthService.getExperimentVariant(id, user.userId)
  }

  @Get('feature-flags')
  async listFeatureFlags() {
    return this.growthService.listFeatureFlags()
  }

  @Post('feature-flags')
  async createFeatureFlag(@Body() dto: CreateFeatureFlagDto) {
    return this.growthService.createFeatureFlag(dto)
  }

  @Put('feature-flags/:key/toggle')
  async toggleFeatureFlag(@Param('key') key: string, @Body() body: { isEnabled: boolean }) {
    return this.growthService.toggleFeatureFlag(key, body.isEnabled)
  }

  @Get('feature-flags/:key/check')
  async checkFeatureFlag(@Param('key') key: string) {
    const enabled = await this.growthService.isFeatureEnabled(key)
    return { key, enabled }
  }

  @Get('campaigns')
  async listCampaigns(@Query() query: OffsetPaginationDto) {
    return this.growthService.listCampaigns(query)
  }

  @Post('campaigns')
  async createCampaign(@Body() dto: CreateCampaignDto) {
    return this.growthService.createCampaign(dto)
  }
}
