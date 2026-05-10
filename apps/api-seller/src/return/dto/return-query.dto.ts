import { IsOptional, IsString, IsEnum } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/core'

export class ReturnQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(['REQUESTED', 'REVIEWING', 'APPROVED', 'REJECTED', 'RETURN_SHIPPING', 'RECEIVED', 'REFUNDED', 'CLOSED'])
  status?: string
}
