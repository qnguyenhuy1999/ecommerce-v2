import { IsOptional, IsString, IsEnum } from 'class-validator'
import { PaginationDto } from '../../common/dto/pagination.dto'

export class ApprovalQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'REVISION_REQUESTED'])
  status?: string
}
