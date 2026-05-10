import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class BannerQueryDto {
  @ApiProperty()
  @IsOptional() @IsString() page?: string;
  @ApiProperty()
  @IsOptional() @IsString() limit?: string;
  @ApiProperty()
  @IsOptional() @IsString() position?: string;
  @ApiProperty()
  @IsOptional() @IsString() status?: string;
}

export class CreateBannerDto {
  @ApiProperty()
  @IsString() title!: string;
  @ApiProperty()
  @IsString() position!: string;
  @ApiProperty()
  @IsString() imageUrl!: string;
  @ApiProperty()
  @IsOptional() @IsString() mobileImageUrl?: string;
  @ApiProperty()
  @IsOptional() @IsString() linkUrl?: string;
  @ApiProperty()
  @IsOptional() @Type(() => Number) @IsInt() sortOrder?: number;
  @ApiProperty()
  @IsOptional() @IsDateString() startsAt?: string;
  @ApiProperty()
  @IsOptional() @IsDateString() endsAt?: string;
}

export class UpdateBannerDto {
  @ApiProperty()
  @IsOptional() @IsString() title?: string;
  @ApiProperty()
  @IsOptional() @IsString() position?: string;
  @ApiProperty()
  @IsOptional() @IsString() status?: string;
  @ApiProperty()
  @IsOptional() @IsString() imageUrl?: string;
  @ApiProperty()
  @IsOptional() @IsString() mobileImageUrl?: string;
  @ApiProperty()
  @IsOptional() @IsString() linkUrl?: string;
  @ApiProperty()
  @IsOptional() @Type(() => Number) @IsInt() sortOrder?: number;
  @ApiProperty()
  @IsOptional() @IsDateString() startsAt?: string;
  @ApiProperty()
  @IsOptional() @IsDateString() endsAt?: string;
}
