import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString, IsEnum, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PlatformVoucherStatus, PlatformVoucherType } from '@ecom/database';

export class VoucherQueryDto {
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

  @ApiPropertyOptional({ enum: PlatformVoucherStatus })
  @IsOptional() @IsEnum(PlatformVoucherStatus) status?: PlatformVoucherStatus;

  @ApiPropertyOptional()
  @IsOptional() @IsString() search?: string;
}

export class CreateVoucherDto {
  @ApiProperty()
  @IsString() code!: string;

  @ApiProperty()
  @IsString() name!: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() description?: string;

  @ApiProperty({ enum: PlatformVoucherType })
  @IsEnum(PlatformVoucherType) type!: PlatformVoucherType;

  @ApiProperty()
  @Type(() => Number) @IsNumber() discountValue!: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber() maxDiscountAmount?: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber() minOrderAmount?: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber() usageLimit?: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber() usageLimitPerUser?: number;

  @ApiProperty()
  @IsDateString() startsAt!: string;

  @ApiProperty()
  @IsDateString() expiresAt!: string;
}

export class UpdateVoucherDto {
  @ApiPropertyOptional()
  @IsOptional() @IsString() name?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() description?: string;

  @ApiPropertyOptional({ enum: PlatformVoucherStatus })
  @IsOptional() @IsEnum(PlatformVoucherStatus) status?: PlatformVoucherStatus;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber() discountValue?: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber() maxDiscountAmount?: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber() minOrderAmount?: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber() usageLimit?: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsNumber() usageLimitPerUser?: number;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString() startsAt?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString() expiresAt?: string;
}

export class VoucherResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() code!: string;
  @ApiProperty() name!: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty({ enum: PlatformVoucherType }) type!: PlatformVoucherType;
  @ApiProperty({ enum: PlatformVoucherStatus }) status!: PlatformVoucherStatus;
  @ApiProperty() discountValue!: number;
  @ApiPropertyOptional() maxDiscountAmount?: number;
  @ApiPropertyOptional() minOrderAmount?: number;
  @ApiPropertyOptional() usageLimit?: number;
  @ApiProperty() usedCount!: number;
  @ApiPropertyOptional() usageLimitPerUser?: number;
  @ApiProperty() startsAt!: Date;
  @ApiProperty() expiresAt!: Date;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}
