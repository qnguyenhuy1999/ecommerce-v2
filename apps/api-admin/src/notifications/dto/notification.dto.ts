import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class NotificationQueryDto {
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() pageSize?: string;
  @IsOptional() @IsString() status?: string;
}

export class CreateNotificationDto {
  @IsString() title!: string;
  @IsString() message!: string;
  @IsOptional() @IsString() channel?: string;
  @IsOptional() @IsBoolean() targetAll?: boolean;
}

export class CreateTemplateDto {
  @IsString() name!: string;
  @IsString() subject!: string;
  @IsString() body!: string;
  @IsOptional() @IsString() channel?: string;
}
