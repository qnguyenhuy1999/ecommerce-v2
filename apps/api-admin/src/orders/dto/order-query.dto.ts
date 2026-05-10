import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OrderQueryDto {
  @ApiProperty()
  @IsOptional() @IsString() page?: string;
  @ApiProperty()
  @IsOptional() @IsString() limit?: string;
  @ApiProperty()
  @IsOptional() @IsString() search?: string;
  @ApiProperty()
  @IsOptional() @IsString() status?: string;
  @ApiProperty()
  @IsOptional() @IsString() buyerId?: string;
}

export class OrderActionDto {
  @ApiProperty()
  @IsOptional() @IsString() reason?: string;
}
