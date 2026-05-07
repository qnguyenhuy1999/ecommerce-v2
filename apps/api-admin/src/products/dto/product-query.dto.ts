import { IsOptional, IsString } from 'class-validator';

export class ProductQueryDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() pageSize?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() shopId?: string;
  @IsOptional() @IsString() categoryId?: string;
}
