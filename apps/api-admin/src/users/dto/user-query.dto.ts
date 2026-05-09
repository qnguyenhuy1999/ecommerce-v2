import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UserQueryDto {
  @ApiProperty()
  @IsOptional() @IsString() page?: string;
  @ApiProperty()
  @IsOptional() @IsString() pageSize?: string;
  @ApiProperty()
  @IsOptional() @IsString() search?: string;
  @ApiProperty()
  @IsOptional() @IsString() status?: string;
}

export class UserActionDto {
  @ApiProperty()
  @IsOptional() @IsString() reason?: string;
}
