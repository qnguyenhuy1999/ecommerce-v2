import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common'
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
import { ShopService } from '../shop/shop.service'
import { WalletService } from './wallet.service'
import type { RequestWithdrawalDto } from './dto/wallet.dto'
import type { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

@ApiTags('Seller/Wallet')
@ApiAuth()
@ApiErrorResponses()
@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  @ApiOkResponseData(Object)
  async getWallet(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.walletService.getWallet(shopId)
  }

  @Get('transactions')
  @ApiPaginatedResponse(Object)
  async listTransactions(@CurrentUser() user: SessionData, @Query() query: OffsetPaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.walletService.listTransactions(shopId, query)
  }

  @Post('withdrawals')
  @ApiCreatedResponseData(Object)
  async requestWithdrawal(@CurrentUser() user: SessionData, @Body() dto: RequestWithdrawalDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.walletService.requestWithdrawal(shopId, dto)
  }

  @Get('withdrawals')
  @ApiPaginatedResponse(Object)
  async listWithdrawals(@CurrentUser() user: SessionData, @Query() query: OffsetPaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.walletService.listWithdrawals(shopId, query)
  }
}
