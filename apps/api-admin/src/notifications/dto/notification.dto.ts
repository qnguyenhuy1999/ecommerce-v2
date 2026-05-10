import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class NotificationQueryDto {
  @ApiProperty()
  @IsOptional() @IsString() page?: string;
  @ApiProperty()
  @IsOptional() @IsString() limit?: string;
  @ApiProperty()
  @IsOptional() @IsString() status?: string;
}

export class CreateNotificationDto {
  @ApiProperty()
  @IsString() title!: string;
  @ApiProperty()
  @IsString() message!: string;
  @ApiProperty()
  @IsOptional() @IsString() channel?: string;
  @ApiProperty()
  @IsOptional() @IsBoolean() targetAll?: boolean;
}

export class CreateTemplateDto {
  @ApiProperty()
  @IsString() name!: string;
  @ApiProperty()
  @IsString() subject!: string;
  @ApiProperty()
  @IsString() body!: string;
  @ApiProperty()
  @IsOptional() @IsString() channel?: string;
}
