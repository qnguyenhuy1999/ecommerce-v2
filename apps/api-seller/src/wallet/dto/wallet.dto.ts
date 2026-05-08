import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'

export class RequestWithdrawalDto {
  @IsNumber()
  @Type(() => Number)
  amount!: number

  @IsOptional()
  @IsString()
  bankName?: string

  @IsOptional()
  @IsString()
  bankAccountNumber?: string

  @IsOptional()
  @IsString()
  bankAccountName?: string

  @IsOptional()
  @IsString()
  note?: string
}

export class ProcessWithdrawalDto {
  @IsEnum(['APPROVED', 'REJECTED'])
  status!: string

  @IsOptional()
  @IsString()
  note?: string
}
