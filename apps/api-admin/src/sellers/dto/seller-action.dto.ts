import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SellerActionDto {
  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  @IsString()
  reason?: string;

  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  @IsString()
  note?: string;
}
