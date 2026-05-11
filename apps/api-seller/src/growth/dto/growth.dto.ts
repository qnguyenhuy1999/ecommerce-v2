import { IsString, IsOptional, IsNumber, IsInt, IsDateString, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateReferralProgramDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsInt()
  @Type(() => Number)
  referrerReward!: number

  @IsInt()
  @Type(() => Number)
  refereeReward!: number

  @IsOptional()
  @IsString()
  rewardType?: string

  @IsOptional()
  @IsDateString()
  startsAt?: string

  @IsOptional()
  @IsDateString()
  endsAt?: string
}

export class CreateExperimentDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  featureKey!: string

  @IsOptional()
  variants?: { name: string; weight: number; config?: Record<string, unknown> }[]

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  trafficPercentage?: number
}

export class CreateFeatureFlagDto {
  @IsString()
  key!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean

  @IsOptional()
  rules?: Record<string, unknown>
}

export class CreateCampaignDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  type!: string

  @IsOptional()
  config?: Record<string, unknown>

  @IsOptional()
  @IsDateString()
  startsAt?: string

  @IsOptional()
  @IsDateString()
  endsAt?: string
}
