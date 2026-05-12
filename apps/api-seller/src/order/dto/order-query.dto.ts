import { IsEnum, IsOptional, IsString } from 'class-validator'
import { OrderStatus } from '@ecom/contracts'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

export class OrderQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus

  @IsOptional()
  @IsString()
  search?: string
}
