import { IsOptional, IsBoolean, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { PaginationDto } from '../../common/dto/pagination.dto'

export class NotificationQueryDto extends PaginationDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  unreadOnly?: boolean

  @IsOptional()
  @IsString()
  type?: string
}
