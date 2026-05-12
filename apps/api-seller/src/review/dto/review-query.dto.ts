import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'
import { ReviewStatus } from '@ecom/contracts/enums'

export class ReviewQueryDto extends OffsetPaginationDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  productId?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number

  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus

  @IsOptional()
  @IsEnum(['hasReply', 'noReply'])
  replyFilter?: 'hasReply' | 'noReply'
}
