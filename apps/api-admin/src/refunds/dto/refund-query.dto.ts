import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RefundQueryDto {
  @ApiProperty()
  @IsOptional() @IsString() page?: string;
  @ApiProperty()
  @IsOptional() @IsString() limit?: string;
  @ApiProperty()
  @IsOptional() @IsString() status?: string;
}

export class RefundActionDto {
  @ApiProperty()
  @IsOptional() @IsString() note?: string;
}
