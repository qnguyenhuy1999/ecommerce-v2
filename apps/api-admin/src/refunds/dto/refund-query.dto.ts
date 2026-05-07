import { IsOptional, IsString } from 'class-validator';

export class RefundQueryDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() pageSize?: string;
  @IsOptional() @IsString() status?: string;
}

export class RefundActionDto {
  @IsOptional() @IsString() note?: string;
}
