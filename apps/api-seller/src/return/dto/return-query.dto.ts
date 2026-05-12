import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { ReturnStatus } from '@ecom/contracts/enums'

export class ReturnQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(ReturnStatus)
  status?: ReturnStatus
}
