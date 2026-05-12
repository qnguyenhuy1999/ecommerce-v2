import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../auth/guards/auth.guard'
import {
  ApiOkResponseData,
  ApiCreatedResponseData,
  ApiErrorResponses,
  ApiAuth,
} from '@ecom/nestjs-core/openapi'
import { I18nService } from './i18n.service'
import { CreateTranslationDto } from './dto/i18n.dto'

@ApiTags('Seller/I18n')
@ApiAuth()
@ApiErrorResponses()
@Controller('i18n')
@UseGuards(AuthGuard)
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get('regions')
  @ApiOkResponseData(Object)
  async listRegions() {
    return this.i18nService.listRegions()
  }

  @Get('regions/:code')
  @ApiOkResponseData(Object)
  async getRegion(@Param('code') code: string) {
    return this.i18nService.getRegion(code)
  }

  @Get('currencies')
  @ApiOkResponseData(Object)
  async listCurrencies() {
    return this.i18nService.listCurrencies()
  }

  @Post('translations')
  @ApiCreatedResponseData(Object)
  async setTranslation(@Body() dto: CreateTranslationDto) {
    return this.i18nService.setTranslation(dto)
  }

  @Get('translations/:entityType/:entityId')
  @ApiOkResponseData(Object)
  async getTranslations(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Query('locale') locale?: string,
  ) {
    return this.i18nService.getTranslations(entityType, entityId, locale)
  }

  @Get('pricing/:productId')
  @ApiOkResponseData(Object)
  async getRegionalPricing(@Param('productId') productId: string) {
    return this.i18nService.getRegionalPricing(productId)
  }

  @Post('pricing/:productId')
  @ApiOkResponseData(Object)
  async setRegionalPricing(
    @Param('productId') productId: string,
    @Body() body: { regionCode: string; price: number },
  ) {
    return this.i18nService.setRegionalPricing(productId, body.regionCode, body.price)
  }

  @Get('convert')
  @ApiOkResponseData(Object)
  async convertPrice(
    @Query('amount') amount: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const result = await this.i18nService.convertPrice(Number(amount), from, to)
    return { amount: Number(amount), from, to, converted: result }
  }
}
