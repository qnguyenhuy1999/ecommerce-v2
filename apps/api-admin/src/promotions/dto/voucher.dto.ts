import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class VoucherQueryDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() pageSize?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() search?: string;
}

export class CreateVoucherDto {
  @IsString() code!: string;
  @IsString() name!: string;
  @IsOptional() @IsString() description?: string;
  @IsString() type!: string;
  @Type(() => Number) @IsNumber() discountValue!: number;
  @IsOptional() @Type(() => Number) @IsNumber() maxDiscountAmount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() minOrderAmount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() usageLimit?: number;
  @IsOptional() @Type(() => Number) @IsNumber() usageLimitPerUser?: number;
  @IsDateString() startsAt!: string;
  @IsDateString() expiresAt!: string;
}

export class UpdateVoucherDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @Type(() => Number) @IsNumber() discountValue?: number;
  @IsOptional() @Type(() => Number) @IsNumber() maxDiscountAmount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() minOrderAmount?: number;
  @IsOptional() @Type(() => Number) @IsNumber() usageLimit?: number;
  @IsOptional() @Type(() => Number) @IsNumber() usageLimitPerUser?: number;
  @IsOptional() @IsDateString() startsAt?: string;
  @IsOptional() @IsDateString() expiresAt?: string;
}
