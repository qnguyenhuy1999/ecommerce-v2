import { IsString, IsOptional, IsDateString, IsNumber, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateAdCampaignDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsEnum(['SPONSORED_PRODUCT', 'SEARCH_AD', 'RECOMMENDATION_AD', 'BANNER'])
  type?: string

  @IsNumber()
  @Type(() => Number)
  dailyBudget!: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  totalBudget?: number

  @IsNumber()
  @Type(() => Number)
  bidAmount!: number

  @IsDateString()
  startsAt!: string

  @IsOptional()
  @IsDateString()
  endsAt?: string
}

export class CreateAdDto {
  @IsString()
  adGroupId!: string

  @IsString()
  productId!: string
}

export class CreateAdGroupDto {
  @IsString()
  campaignId!: string

  @IsString()
  name!: string

  @IsOptional()
  keywords?: { keyword: string; bidAmount?: number }[]
}
