import { IsString, IsOptional, IsUUID } from 'class-validator'

export class CreateShipmentDto {
  @IsUUID()
  sellerOrderId!: string

  @IsUUID()
  providerId!: string

  @IsOptional()
  @IsString()
  trackingNumber?: string
}
