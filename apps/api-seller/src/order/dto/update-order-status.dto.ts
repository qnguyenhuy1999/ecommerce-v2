import { IsEnum, IsOptional, IsString } from 'class-validator'
import { OrderStatus } from '@ecom/contracts'

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus

  @IsOptional()
  @IsString()
  note?: string
}
