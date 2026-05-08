import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common'
import type { SessionData } from '@ecom/auth'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ShopService } from '../shop/shop.service'
import { WalletService } from './wallet.service'
import { RequestWithdrawalDto } from './dto/wallet.dto'
import { PaginationDto } from '../common/dto/pagination.dto'

@Controller('wallet')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly shopService: ShopService,
  ) {}

  @Get()
  async getWallet(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.walletService.getWallet(shopId)
  }

  @Get('transactions')
  async listTransactions(@CurrentUser() user: SessionData, @Query() query: PaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.walletService.listTransactions(shopId, query)
  }

  @Post('withdrawals')
  async requestWithdrawal(@CurrentUser() user: SessionData, @Body() dto: RequestWithdrawalDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.walletService.requestWithdrawal(shopId, dto)
  }

  @Get('withdrawals')
  async listWithdrawals(@CurrentUser() user: SessionData, @Query() query: PaginationDto) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.walletService.listWithdrawals(shopId, query)
  }
}
