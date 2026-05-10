import { IsOptional, IsBoolean, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { OffsetPaginationDto } from '@ecom/shared/pagination/core'

export class NotificationQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  unreadOnly?: boolean

  @IsOptional()
  @IsString()
  type?: string
}
