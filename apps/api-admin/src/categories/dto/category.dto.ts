import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class CategoryQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  parentId?: string
}

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  name!: string
  @ApiProperty()
  @IsString()
  slug!: string
  @ApiProperty()
  @IsOptional()
  @IsString()
  parentId?: string
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string
  @ApiProperty()
  @IsOptional()
  @IsString()
  icon?: string
  @ApiProperty()
  @IsOptional()
  @IsString()
  banner?: string
  @ApiProperty()
  @IsOptional()
  @IsString()
  metaTitle?: string
  @ApiProperty()
  @IsOptional()
  @IsString()
  metaDesc?: string
}

export class UpdateCategoryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string
  @ApiProperty()
  @IsOptional()
  @IsString()
  slug?: string
  @ApiProperty()
  @IsOptional()
  @IsString()
  parentId?: string | null
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string
  @ApiProperty()
  @IsOptional()
  @IsString()
  icon?: string
  @ApiProperty()
  @IsOptional()
  @IsString()
  banner?: string
  @ApiProperty()
  @IsOptional()
  @IsString()
  metaTitle?: string
  @ApiProperty()
  @IsOptional()
  @IsString()
  metaDesc?: string
}

export class CategoryResponseDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() slug!: string
  @ApiPropertyOptional() parentId?: string
  @ApiProperty() sortOrder!: number
  @ApiProperty() isActive!: boolean
  @ApiProperty() createdAt!: Date
  @ApiProperty() updatedAt!: Date
}

export class ReorderDto {
  items!: { id: string; sortOrder: number }[]
}
