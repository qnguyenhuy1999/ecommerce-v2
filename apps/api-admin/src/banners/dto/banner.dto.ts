import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class BannerQueryDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() pageSize?: string;
  @IsOptional() @IsString() position?: string;
  @IsOptional() @IsString() status?: string;
}

export class CreateBannerDto {
  @IsString() title!: string;
  @IsString() position!: string;
  @IsString() imageUrl!: string;
  @IsOptional() @IsString() mobileImageUrl?: string;
  @IsOptional() @IsString() linkUrl?: string;
  @IsOptional() @Type(() => Number) @IsInt() sortOrder?: number;
  @IsOptional() @IsDateString() startsAt?: string;
  @IsOptional() @IsDateString() endsAt?: string;
}

export class UpdateBannerDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() position?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() mobileImageUrl?: string;
  @IsOptional() @IsString() linkUrl?: string;
  @IsOptional() @Type(() => Number) @IsInt() sortOrder?: number;
  @IsOptional() @IsDateString() startsAt?: string;
  @IsOptional() @IsDateString() endsAt?: string;
}
