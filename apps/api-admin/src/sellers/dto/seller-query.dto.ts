import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SellerStatus } from '@ecom/database';

export class SellerQueryDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  pageSize?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SellerStatus)
  status?: SellerStatus;
}
