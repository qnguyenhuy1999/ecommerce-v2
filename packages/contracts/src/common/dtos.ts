import { IsBoolean, IsOptional, IsString, IsObject, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationMetaDto {
  @IsNumber()
  total!: number;

  @IsNumber()
  page!: number;

  @IsNumber()
  limit!: number;

  @IsNumber()
  totalPages!: number;

  @IsBoolean()
  hasNextPage!: boolean;

  @IsBoolean()
  hasPreviousPage!: boolean;
}

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
