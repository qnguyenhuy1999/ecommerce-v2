import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { OffsetPaginationDto } from '@ecom/shared/pagination/nestjs'

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
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED', 'HIDDEN'])
  status?: string

  @IsOptional()
  @IsEnum(['hasReply', 'noReply'])
  replyFilter?: string
}
