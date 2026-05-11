import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
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
import { GrowthService } from './growth.service'
import type {
  CreateReferralProgramDto,
  CreateExperimentDto,
  CreateFeatureFlagDto,
  CreateCampaignDto,
} from './dto/growth.dto'
import type { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@ApiTags('Seller/Growth')
@ApiAuth()
@ApiErrorResponses()
@Controller('growth')
@UseGuards(AuthGuard)
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Get('referrals')
  @ApiPaginatedResponse(Object)
  async listReferralPrograms(@Query() query: OffsetPaginationDto) {
    return this.growthService.listReferralPrograms(query)
  }

  @Post('referrals/programs')
  @ApiCreatedResponseData(Object)
  async createReferralProgram(@Body() dto: CreateReferralProgramDto) {
    return this.growthService.createReferralProgram(dto)
  }

  @Post('referrals/create')
  @ApiCreatedResponseData(Object)
  async createReferral(@CurrentUser() user: SessionData, @Body() body: { programId: string }) {
    return this.growthService.createReferral(body.programId, user.userId)
  }

  @Get('experiments')
  @ApiPaginatedResponse(Object)
  async listExperiments(@Query() query: OffsetPaginationDto) {
    return this.growthService.listExperiments(query)
  }

  @Post('experiments')
  @ApiCreatedResponseData(Object)
  async createExperiment(@Body() dto: CreateExperimentDto) {
    return this.growthService.createExperiment(dto)
  }

  @Get('experiments/:id/variant')
  @ApiOkResponseData(Object)
  async getVariant(@CurrentUser() user: SessionData, @Param('id') id: string) {
    return this.growthService.getExperimentVariant(id, user.userId)
  }

  @Get('feature-flags')
  @ApiOkResponseData(Object)
  async listFeatureFlags() {
    return this.growthService.listFeatureFlags()
  }

  @Post('feature-flags')
  @ApiCreatedResponseData(Object)
  async createFeatureFlag(@Body() dto: CreateFeatureFlagDto) {
    return this.growthService.createFeatureFlag(dto)
  }

  @Put('feature-flags/:key/toggle')
  @ApiOkResponseData(Object)
  async toggleFeatureFlag(@Param('key') key: string, @Body() body: { isEnabled: boolean }) {
    return this.growthService.toggleFeatureFlag(key, body.isEnabled)
  }

  @Get('feature-flags/:key/check')
  @ApiOkResponseData(Object)
  async checkFeatureFlag(@Param('key') key: string) {
    const enabled = await this.growthService.isFeatureEnabled(key)
    return { key, enabled }
  }

  @Get('campaigns')
  @ApiPaginatedResponse(Object)
  async listCampaigns(@Query() query: OffsetPaginationDto) {
    return this.growthService.listCampaigns(query)
  }

  @Post('campaigns')
  @ApiCreatedResponseData(Object)
  async createCampaign(@Body() dto: CreateCampaignDto) {
    return this.growthService.createCampaign(dto)
  }
}
