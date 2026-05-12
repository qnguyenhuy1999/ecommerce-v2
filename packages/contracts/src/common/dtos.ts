import { IsBoolean, IsOptional, IsString, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PaginationMetaDto {
  @ApiProperty({ description: 'Total number of items', example: 100 })
  @IsNumber()
  total!: number

  @ApiProperty({ description: 'Current page number', example: 1 })
  @IsNumber()
  page!: number

  @ApiProperty({ description: 'Items per page', example: 20 })
  @IsNumber()
  limit!: number

  @ApiProperty({ description: 'Total number of pages', example: 5 })
  @IsNumber()
  totalPages!: number

  @ApiProperty({ description: 'Whether there is a next page', example: true })
  @IsBoolean()
  hasNextPage!: boolean

  @ApiProperty({ description: 'Whether there is a previous page', example: false })
  @IsBoolean()
  hasPreviousPage!: boolean
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10

  @ApiPropertyOptional({ description: 'Field to sort by' })
  @IsOptional()
  @IsString()
  sortBy?: string

  @ApiPropertyOptional({ description: 'Sort direction', enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC'
}
