import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { ApprovalStatus } from '@ecom/contracts/enums'

export class ApprovalQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(ApprovalStatus)
  status?: ApprovalStatus
}
