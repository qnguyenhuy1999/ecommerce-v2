import { IsString, IsOptional, IsDateString, IsInt, Min, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateFlashSaleCampaignDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsDateString()
  startsAt!: string

  @IsDateString()
  endsAt!: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxSlotsPerSeller?: number

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean
}
