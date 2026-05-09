import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class VoucherQueryDto {
  @ApiProperty()
  @IsOptional() @IsString() page?: string;
  @ApiProperty()
  @IsOptional() @IsString() pageSize?: string;
  @ApiProperty()
  @IsOptional() @IsString() status?: string;
  @ApiProperty()
  @IsOptional() @IsString() search?: string;
}

export class CreateVoucherDto {
  @ApiProperty()
  @IsString() code!: string;
  @ApiProperty()
  @IsString() name!: string;
  @ApiProperty()
  @IsOptional() @IsString() description?: string;
  @ApiProperty()
  @IsString() type!: string;
  @ApiProperty()
  @Type(() => Number) @IsNumber() discountValue!: number;
  @ApiProperty()
  @IsOptional() @Type(() => Number) @IsNumber() maxDiscountAmount?: number;
  @ApiProperty()
  @IsOptional() @Type(() => Number) @IsNumber() minOrderAmount?: number;
  @ApiProperty()
  @IsOptional() @Type(() => Number) @IsNumber() usageLimit?: number;
  @ApiProperty()
  @IsOptional() @Type(() => Number) @IsNumber() usageLimitPerUser?: number;
  @ApiProperty()
  @IsDateString() startsAt!: string;
  @ApiProperty()
  @IsDateString() expiresAt!: string;
}

export class UpdateVoucherDto {
  @ApiProperty()
  @IsOptional() @IsString() name?: string;
  @ApiProperty()
  @IsOptional() @IsString() description?: string;
  @ApiProperty()
  @IsOptional() @IsString() status?: string;
  @ApiProperty()
  @IsOptional() @Type(() => Number) @IsNumber() discountValue?: number;
  @ApiProperty()
  @IsOptional() @Type(() => Number) @IsNumber() maxDiscountAmount?: number;
  @ApiProperty()
  @IsOptional() @Type(() => Number) @IsNumber() minOrderAmount?: number;
  @ApiProperty()
  @IsOptional() @Type(() => Number) @IsNumber() usageLimit?: number;
  @ApiProperty()
  @IsOptional() @Type(() => Number) @IsNumber() usageLimitPerUser?: number;
  @ApiProperty()
  @IsOptional() @IsDateString() startsAt?: string;
  @ApiProperty()
  @IsOptional() @IsDateString() expiresAt?: string;
}
