import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/guards/auth.guard'
import { LoyaltyService } from './loyalty.service'
import { OffsetPaginationDto } from '@ecom/pagination'

@Controller('loyalty')
@UseGuards(AuthGuard)
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('tiers')
  async listTiers() {
    return this.loyaltyService.listTiers()
  }

  @Get('missions')
  async listMissions(@Query() query: OffsetPaginationDto) {
    return this.loyaltyService.listMissions(query)
  }
}
