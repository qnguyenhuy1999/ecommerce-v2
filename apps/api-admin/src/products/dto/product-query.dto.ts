import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductQueryDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;

  @ApiProperty()
  @IsOptional() @IsString() search?: string;
  @ApiProperty()
  @IsOptional() @IsString() status?: string;
  @ApiProperty()
  @IsOptional() @IsString() shopId?: string;
  @ApiProperty()
  @IsOptional() @IsString() categoryId?: string;
}
