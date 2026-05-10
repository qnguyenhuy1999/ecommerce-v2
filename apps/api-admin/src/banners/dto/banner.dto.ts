import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsDateString, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BannerPosition, BannerStatus } from '@ecom/database';

export class BannerQueryDto {
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

  @ApiPropertyOptional({ enum: BannerPosition })
  @IsOptional() @IsEnum(BannerPosition) position?: BannerPosition;

  @ApiPropertyOptional({ enum: BannerStatus })
  @IsOptional() @IsEnum(BannerStatus) status?: BannerStatus;
}

export class CreateBannerDto {
  @ApiProperty()
  @IsString() title!: string;

  @ApiProperty({ enum: BannerPosition })
  @IsEnum(BannerPosition) position!: BannerPosition;

  @ApiProperty()
  @IsString() imageUrl!: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() mobileImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() linkUrl?: string;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsInt() sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString() startsAt?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString() endsAt?: string;
}

export class UpdateBannerDto {
  @ApiPropertyOptional()
  @IsOptional() @IsString() title?: string;

  @ApiPropertyOptional({ enum: BannerPosition })
  @IsOptional() @IsEnum(BannerPosition) position?: BannerPosition;

  @ApiPropertyOptional({ enum: BannerStatus })
  @IsOptional() @IsEnum(BannerStatus) status?: BannerStatus;

  @ApiPropertyOptional()
  @IsOptional() @IsString() imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() mobileImageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() linkUrl?: string;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsInt() sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString() startsAt?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString() endsAt?: string;
}

export class BannerResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() title!: string;
  @ApiProperty({ enum: BannerPosition }) position!: BannerPosition;
  @ApiProperty({ enum: BannerStatus }) status!: BannerStatus;
  @ApiProperty() imageUrl!: string;
  @ApiPropertyOptional() mobileImageUrl?: string;
  @ApiPropertyOptional() linkUrl?: string;
  @ApiProperty() sortOrder!: number;
  @ApiPropertyOptional() startsAt?: Date;
  @ApiPropertyOptional() endsAt?: Date;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}
