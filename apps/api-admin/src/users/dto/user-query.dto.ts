import { IsOptional, IsString } from 'class-validator';

export class UserQueryDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() pageSize?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() status?: string;
}

export class UserActionDto {
  @IsOptional() @IsString() reason?: string;
}
