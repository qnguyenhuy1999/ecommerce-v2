import { IsOptional, IsString } from 'class-validator';

export class ReviewQueryDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() pageSize?: string;
  @IsOptional() @IsString() status?: string;
}

export class ReviewActionDto {
  @IsOptional() @IsString() note?: string;
}
