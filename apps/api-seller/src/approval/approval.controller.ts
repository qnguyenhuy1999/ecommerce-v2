import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
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
} from '@ecom/nestjs-openapi'
import { ShopService } from '../shop/shop.service'
import { ApprovalService } from './approval.service'
import { ApprovalQueryDto } from './dto/approval-query.dto'

@ApiTags('Seller/Approvals')
@ApiAuth()
@ApiErrorResponses()
@Controller('approvals')
@UseGuards(AuthGuard)
export class ApprovalController {
  constructor(
    private readonly approvalService: ApprovalService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  @ApiPaginatedResponse(Object)
  async list(@CurrentUser() user: SessionData, @Query() query: ApprovalQueryDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.approvalService.list(shopId, query)
  }

  @Get(':id')
  @ApiOkResponseData(Object)
  async getById(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.approvalService.getById(shopId, id)
  }

  @Get('product/:productId')
  @ApiOkResponseData(Object)
  async getByProduct(@CurrentUser() user: SessionData, @Param('productId') productId: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.approvalService.getByProduct(shopId, productId)
  }

  @Post('product/:productId/submit')
  @ApiCreatedResponseData(Object)
  async submit(@CurrentUser() user: SessionData, @Param('productId') productId: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.approvalService.submitForReview(shopId, productId)
  }

  @Post(':id/resubmit')
  @ApiCreatedResponseData(Object)
  async resubmit(@CurrentUser() user: SessionData, @Param('id') id: string) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.approvalService.resubmit(shopId, id)
  }
}
