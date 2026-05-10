import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ReviewQueryDto {
  @ApiProperty()
  @IsOptional() @IsString() page?: string;
  @ApiProperty()
  @IsOptional() @IsString() limit?: string;
  @ApiProperty()
  @IsOptional() @IsString() status?: string;
}

export class ReviewActionDto {
  @ApiProperty()
  @IsOptional() @IsString() note?: string;
}
