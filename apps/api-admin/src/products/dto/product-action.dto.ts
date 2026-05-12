import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsArray, ArrayNotEmpty, ArrayMaxSize } from 'class-validator'

export class ProductModerationDto {
  @ApiPropertyOptional({ description: 'Optional moderation note' })
  @IsOptional()
  @IsString()
  note?: string
}

export class BulkModerationDto {
  @ApiProperty({ description: 'Product IDs to moderate', type: [String], maxItems: 100 })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  ids!: string[]

  @ApiPropertyOptional({ description: 'Optional moderation note' })
  @IsOptional()
  @IsString()
  note?: string
}

export class ResolveReportDto {
  @ApiPropertyOptional({ description: 'Admin note for the resolution' })
  @IsOptional()
  @IsString()
  adminNote?: string
}
