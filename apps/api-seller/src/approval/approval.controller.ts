import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { ApprovalService } from './approval.service'
import { ApprovalQueryDto } from './dto/approval-query.dto'

@Controller('approvals')
@UseGuards(AuthGuard)
export class ApprovalController {
  constructor(
    private readonly approvalService: ApprovalService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  async list(@CurrentUser() user: SessionData, @Query() query: ApprovalQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.approvalService.list(shopId, query)
  }

  @Get(':id')
  async getById(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.approvalService.getById(shopId, id)
  }

  @Get('product/:productId')
  async getByProduct(@CurrentUser() user: SessionData, @Param('productId') productId: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.approvalService.getByProduct(shopId, productId)
  }

  @Post('product/:productId/submit')
  async submit(@CurrentUser() user: SessionData, @Param('productId') productId: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.approvalService.submitForReview(shopId, productId)
  }

  @Post(':id/resubmit')
  async resubmit(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.approvalService.resubmit(shopId, id)
  }
}
