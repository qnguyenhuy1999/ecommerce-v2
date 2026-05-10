import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/guards/auth.guard'
import {
  ApiOkResponseData,
  ApiPaginatedResponse,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-openapi'
import { LoyaltyService } from './loyalty.service'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@ApiTags('Seller/Loyalty')
@ApiAuth()
@ApiErrorResponses()
@Controller('loyalty')
@UseGuards(AuthGuard)
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('tiers')
  @ApiOkResponseData(Object)
  async listTiers() {
    return this.loyaltyService.listTiers()
  }

  @Get('missions')
  @ApiPaginatedResponse(Object)
  async listMissions(@Query() query: OffsetPaginationDto) {
    return this.loyaltyService.listMissions(query)
  }
}
