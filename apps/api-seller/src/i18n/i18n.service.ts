import { Injectable, NotFoundException } from '@nestjs/common'
import type { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import type { CreateTranslationDto, CreateCurrencyDto, CreateRegionDto } from './dto/i18n.dto'
import { withDefined } from '@ecom/shared/utils'

@Injectable()
export class I18nService {
  constructor(private readonly prisma: PrismaService) {}
  async listRegions() {
    return this.prisma.region.findMany({
      where: { isActive: true },
      include: { _count: { select: { regionalPricings: true } } },
      orderBy: { name: 'asc' },
    })
  }

  async getRegion(code: string) {
    const region = await this.prisma.region.findUnique({ where: { code } })
    if (!region) throw new NotFoundException('Region not found')
    return region
  }

  async createRegion(dto: CreateRegionDto) {
    return this.prisma.region.create({
      data: {
        code: dto.code,
        name: dto.name,
        defaultLocale: dto.defaultLocale,
        defaultCurrencyId: dto.defaultCurrency,
        ...withDefined({ timezone: dto.timezone }),
        taxRates: {
          create: {
            name: 'Default',
            rate: dto.taxRate ?? 0,
          },
        },
      },
    })
  }

  async listCurrencies() {
    return this.prisma.currency.findMany({
      where: { isActive: true },
      orderBy: { code: 'asc' },
    })
  }

  async createCurrency(dto: CreateCurrencyDto) {
    return this.prisma.currency.create({
      data: {
        code: dto.code,
        name: dto.name,
        symbol: dto.symbol,
        exchangeRate: dto.exchangeRate ?? 1,
      },
    })
  }

  async updateExchangeRate(code: string, rate: number) {
    const currency = await this.prisma.currency.findUnique({ where: { code } })
    if (!currency) throw new NotFoundException('Currency not found')

    return this.prisma.currency.update({
      where: { code },
      data: { exchangeRate: rate },
    })
  }

  async setTranslation(dto: CreateTranslationDto) {
    return this.prisma.translation.upsert({
      where: {
        entityType_entityId_locale_field: {
          entityType: dto.entityType,
          entityId: dto.entityId,
          field: dto.field,
          locale: dto.locale,
        },
      },
      update: { value: dto.value },
      create: {
        entityType: dto.entityType,
        entityId: dto.entityId,
        field: dto.field,
        locale: dto.locale,
        value: dto.value,
      },
    })
  }

  async getTranslations(entityType: string, entityId: string, locale?: string) {
    const where: Prisma.TranslationWhereInput = { entityType, entityId }
    if (locale) where.locale = locale

    return this.prisma.translation.findMany({ where })
  }

  async setRegionalPricing(
    productId: string,
    regionCode: string,
    price: number,
    _currencyCode?: string,
  ) {
    const region = await this.prisma.region.findUnique({ where: { code: regionCode } })
    if (!region) throw new NotFoundException('Region not found')

    return this.prisma.regionalPricing.upsert({
      where: { productId_regionId: { productId, regionId: region.id } },
      update: { price, currencyCode: region.defaultCurrencyId ?? 'USD' },
      create: {
        productId,
        regionId: region.id,
        price,
        currencyCode: region.defaultCurrencyId ?? 'USD',
      },
    })
  }

  async getRegionalPricing(productId: string) {
    return this.prisma.regionalPricing.findMany({
      where: { productId },
      include: { region: { select: { code: true, name: true, defaultCurrencyId: true } } },
    })
  }

  async convertPrice(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return amount

    const [from, to] = await Promise.all([
      this.prisma.currency.findUnique({ where: { code: fromCurrency } }),
      this.prisma.currency.findUnique({ where: { code: toCurrency } }),
    ])

    if (!from || !to) throw new NotFoundException('Currency not found')

    const usdAmount = amount / Number(from.exchangeRate)
    return Math.round(usdAmount * Number(to.exchangeRate) * 100) / 100
  }
}
