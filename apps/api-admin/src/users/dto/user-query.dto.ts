import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { UserStatus } from '@ecom/database';

export class UserQueryDto {
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
  @IsOptional() @IsString() search?: string;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional() @IsEnum(UserStatus) status?: UserStatus;
}

export class UserActionDto {
  @ApiPropertyOptional()
  @IsOptional() @IsString() reason?: string;
}

export class UserResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() email!: string;
  @ApiProperty() firstName!: string;
  @ApiProperty() lastName!: string;
  @ApiPropertyOptional() phone?: string;
  @ApiProperty() emailVerified!: boolean;
  @ApiProperty({ enum: UserStatus }) status!: UserStatus;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}
