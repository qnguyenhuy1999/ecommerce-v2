import { IsString, IsOptional, IsNumber, IsEnum, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class CreatePlanDto {
  @IsString()
  name!: string

  @IsString()
  slug!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsNumber()
  @Type(() => Number)
  monthlyPrice!: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  yearlyPrice?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  productLimit?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orderLimit?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  storageLimit?: number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  staffLimit?: number
}

export class SubscribeDto {
  @IsString()
  planId!: string

  @IsOptional()
  @IsEnum(['monthly', 'yearly'])
  billingCycle?: string
}
