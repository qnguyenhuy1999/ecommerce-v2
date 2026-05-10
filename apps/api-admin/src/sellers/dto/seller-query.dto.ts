import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SellerStatus } from '@ecom/database';

export class SellerQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: SellerStatus })
  @IsOptional()
  @IsEnum(SellerStatus)
  status?: SellerStatus;
}

export class SellerResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() userId!: string;
  @ApiProperty() shopName!: string;
  @ApiProperty() shopDescription!: string;
  @ApiProperty({ enum: SellerStatus }) status!: SellerStatus;
  @ApiPropertyOptional() phoneNumber?: string;
  @ApiPropertyOptional() address?: string;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}
