import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateAffiliateLinkDto {
  @IsOptional()
  @IsString()
  productId?: string

  @IsOptional()
  @IsString()
  shopId?: string

  @IsString()
  url!: string
}

export class UpdateAffiliateStatusDto {
  @IsEnum(['APPROVED', 'REJECTED', 'SUSPENDED'])
  status!: string
}

export class RequestPayoutDto {
  @IsNumber()
  @Type(() => Number)
  amount!: number

  @IsOptional()
  @IsString()
  paymentMethod?: string

  @IsOptional()
  @IsString()
  note?: string
}
