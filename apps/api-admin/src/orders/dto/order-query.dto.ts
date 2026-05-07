import { IsOptional, IsString } from 'class-validator';

export class OrderQueryDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() pageSize?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() buyerId?: string;
}

export class OrderActionDto {
  @IsOptional() @IsString() reason?: string;
}
