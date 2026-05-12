import { IsOptional, IsBoolean, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { NotificationType } from '@ecom/database'

export class NotificationQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  unreadOnly?: boolean

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType
}
