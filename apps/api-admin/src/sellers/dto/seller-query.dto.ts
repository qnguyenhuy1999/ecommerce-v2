import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { SellerStatus, ShopStatus, UserStatus } from '@ecom/contracts/enums'

export class SellerQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ enum: SellerStatus })
  @IsOptional()
  @IsEnum(SellerStatus)
  status?: SellerStatus
}

export class SellerUserDto {
  @ApiProperty() id!: string
  @ApiProperty() email!: string
  @ApiProperty({ enum: UserStatus }) status!: UserStatus
  @ApiPropertyOptional() createdAt?: Date
}

export class SellerShopDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiPropertyOptional() description?: string | null
  @ApiProperty({ enum: ShopStatus }) status!: ShopStatus
}

export class SellerResponseDto {
  @ApiProperty() id!: string
  @ApiProperty() userId!: string
  @ApiPropertyOptional() sellerProfileId?: string | null
  @ApiPropertyOptional() shopId?: string | null
  @ApiProperty({ enum: SellerStatus }) status!: SellerStatus
  @ApiPropertyOptional() phone?: string | null
  @ApiPropertyOptional() address?: string
  @ApiProperty() createdAt!: Date
  @ApiProperty() updatedAt!: Date
  @ApiProperty({ type: SellerUserDto }) user!: SellerUserDto
  @ApiPropertyOptional({ type: SellerShopDto }) shop?: SellerShopDto | null
}
