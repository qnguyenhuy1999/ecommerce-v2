import { IsOptional, IsString, IsEnum } from 'class-validator'
import { PaginationDto } from '../../common/dto/pagination.dto'

export class CouponQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(['DRAFT', 'ACTIVE', 'PAUSED', 'EXPIRED', 'DEPLETED'])
  status?: string

  @IsOptional()
  @IsEnum(['PERCENTAGE', 'FIXED_AMOUNT'])
  type?: string
}
