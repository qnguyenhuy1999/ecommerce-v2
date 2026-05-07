import { IsOptional, IsString, IsArray } from 'class-validator';

export class ProductModerationDto {
  @IsOptional() @IsString() note?: string;
}

export class BulkModerationDto {
  @IsArray() @IsString({ each: true }) ids!: string[];
  @IsOptional() @IsString() note?: string;
}

export class ResolveReportDto {
  @IsOptional() @IsString() adminNote?: string;
}
