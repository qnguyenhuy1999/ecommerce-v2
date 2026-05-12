import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator'
import { Type } from 'class-transformer'
import { AdType } from '@ecom/database'

export class AdKeywordDto {
  @IsString()
  keyword!: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  bidAmount?: number
}

export class CreateAdCampaignDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsEnum(AdType)
  type?: AdType

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdKeywordDto)
  keywords?: AdKeywordDto[]
}
