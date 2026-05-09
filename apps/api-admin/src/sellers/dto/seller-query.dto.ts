import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SellerStatus } from '@ecom/database';

export class SellerQueryDto {
  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  @IsString()
  page?: string;

  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  @IsString()
  pageSize?: string;

  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  @IsString()
  search?: string;

  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  @IsEnum(SellerStatus)
  status?: SellerStatus;
}
