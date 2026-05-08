import { IsString, IsOptional, IsEnum } from 'class-validator'

export class CreateAiTaskDto {
  @IsEnum([
    'DESCRIPTION_GENERATION',
    'TITLE_OPTIMIZATION',
    'KEYWORD_GENERATION',
    'IMAGE_TAGGING',
    'CATEGORY_SUGGESTION',
    'SEO_OPTIMIZATION',
    'TRANSLATION',
    'SALES_INSIGHT',
  ])
  type!: string

  @IsOptional()
  @IsString()
  productId?: string

  @IsOptional()
  input?: Record<string, unknown>
}
