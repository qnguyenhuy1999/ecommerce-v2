import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/pagination'

export class ReturnQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(['REQUESTED', 'REVIEWING', 'APPROVED', 'REJECTED', 'RETURN_SHIPPING', 'RECEIVED', 'REFUNDED', 'CLOSED'])
  status?: string
}
