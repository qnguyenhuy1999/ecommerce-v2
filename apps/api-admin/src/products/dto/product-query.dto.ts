import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { ProductStatus } from '@ecom/database'

export class ProductQueryDto {
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

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shopId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string
}

export class ProductResponseDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiProperty() description!: string
  @ApiProperty() price!: number
  @ApiProperty() status!: string
  @ApiProperty() createdAt!: Date
  @ApiProperty() updatedAt!: Date
}
