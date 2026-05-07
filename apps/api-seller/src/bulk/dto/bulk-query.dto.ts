import { IsOptional, IsEnum } from 'class-validator'
import { PaginationDto } from '../../common/dto/pagination.dto'

export class BulkJobQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(['PRODUCT_IMPORT', 'PRODUCT_EXPORT', 'INVENTORY_UPDATE', 'PRICE_UPDATE'])
  type?: string

  @IsOptional()
  @IsEnum(['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'PARTIALLY_COMPLETED'])
  status?: string
}
