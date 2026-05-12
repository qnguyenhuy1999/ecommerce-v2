import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsBoolean, IsEnum, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { AdminNotificationStatus, NotificationChannel } from '@ecom/database'

export class NotificationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20

  @ApiPropertyOptional({ enum: AdminNotificationStatus })
  @IsOptional()
  @IsEnum(AdminNotificationStatus)
  status?: AdminNotificationStatus
}

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  title!: string

  @ApiProperty()
  @IsString()
  message!: string

  @ApiPropertyOptional({ enum: NotificationChannel, default: 'IN_APP' })
  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  targetAll?: boolean
}

export class CreateTemplateDto {
  @ApiProperty()
  @IsString()
  name!: string

  @ApiProperty()
  @IsString()
  subject!: string

  @ApiProperty()
  @IsString()
  body!: string

  @ApiPropertyOptional({ enum: NotificationChannel, default: 'IN_APP' })
  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel
}

export class NotificationResponseDto {
  @ApiProperty() id!: string
  @ApiProperty() title!: string
  @ApiProperty() message!: string
  @ApiProperty({ enum: NotificationChannel }) channel!: NotificationChannel
  @ApiProperty({ enum: AdminNotificationStatus }) status!: AdminNotificationStatus
  @ApiProperty() targetAll!: boolean
  @ApiPropertyOptional() sentAt?: Date
  @ApiProperty() createdAt!: Date
  @ApiProperty() updatedAt!: Date
}

export class NotificationTemplateResponseDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() subject!: string
  @ApiProperty() body!: string
  @ApiProperty({ enum: NotificationChannel }) channel!: NotificationChannel
  @ApiProperty() createdAt!: Date
  @ApiProperty() updatedAt!: Date
}
