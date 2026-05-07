import { IsOptional, IsString, IsEnum } from 'class-validator'
import { PaginationDto } from '../../common/dto/pagination.dto'

export class ReturnQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(['REQUESTED', 'REVIEWING', 'APPROVED', 'REJECTED', 'RETURN_SHIPPING', 'RECEIVED', 'REFUNDED', 'CLOSED'])
  status?: string
}
