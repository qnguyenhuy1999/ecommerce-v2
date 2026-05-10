import { IsOptional, IsEnum } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

export class BulkJobQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsEnum(['PRODUCT_IMPORT', 'PRODUCT_EXPORT', 'INVENTORY_UPDATE', 'PRICE_UPDATE'])
  type?: string

  @IsOptional()
  @IsEnum(['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'PARTIALLY_COMPLETED'])
  status?: string
}
