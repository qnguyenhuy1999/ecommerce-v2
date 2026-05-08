import { IsOptional, IsString, IsArray, ArrayNotEmpty, ArrayMaxSize } from 'class-validator';

export class ProductModerationDto {
  @IsOptional() @IsString() note?: string;
}

export class BulkModerationDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  ids!: string[];
  @IsOptional() @IsString() note?: string;
}

export class ResolveReportDto {
  @IsOptional() @IsString() adminNote?: string;
}
