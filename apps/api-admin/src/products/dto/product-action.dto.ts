import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsArray, ArrayNotEmpty, ArrayMaxSize } from 'class-validator'

export class ProductModerationDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  note?: string
}

export class BulkModerationDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @ApiProperty()
  @IsString({ each: true })
  ids!: string[]
  @ApiProperty()
  @IsOptional()
  @IsString()
  note?: string
}

export class ResolveReportDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  adminNote?: string
}
