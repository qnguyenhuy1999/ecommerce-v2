import { IsOptional, IsString } from 'class-validator';

export class SellerActionDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
