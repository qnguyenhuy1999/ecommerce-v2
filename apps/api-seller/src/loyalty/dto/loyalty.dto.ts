import { IsString, IsOptional, IsNumber, IsInt, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateLoyaltyTierDto {
  @IsString()
  name!: string

  @IsString()
  slug!: string

  @IsInt()
  @Type(() => Number)
  minPoints!: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pointMultiplier?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cashbackRate?: number

  @IsOptional()
  benefits?: Record<string, unknown>
}

export class CreateMissionDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  type!: string

  @IsInt()
  @Type(() => Number)
  rewardPoints!: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  targetCount?: number

  @IsOptional()
  @IsDateString()
  startsAt?: string

  @IsOptional()
  @IsDateString()
  endsAt?: string
}

export class RedeemPointsDto {
  @IsInt()
  @Type(() => Number)
  points!: number

  @IsOptional()
  @IsString()
  orderId?: string

  @IsOptional()
  @IsString()
  description?: string
}
