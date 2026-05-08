import { IsOptional, IsString } from 'class-validator'
import { OffsetPaginationDto } from '@ecom/pagination'

export class ConversationQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string
}

export class MessageQueryDto extends OffsetPaginationDto {}
