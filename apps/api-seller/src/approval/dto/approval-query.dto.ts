import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

export class ApprovalQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'REVISION_REQUESTED'])
  status?: string
}
