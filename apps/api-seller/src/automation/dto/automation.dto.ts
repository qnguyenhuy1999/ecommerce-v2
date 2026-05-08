import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator'

export class CreateAutomationRuleDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsEnum([
    'ORDER_CREATED',
    'ORDER_CANCELLED',
    'LOW_STOCK',
    'NEW_REVIEW',
    'NEW_CHAT',
    'PRICE_CHANGE',
    'SCHEDULE',
  ])
  trigger!: string

  @IsEnum([
    'SEND_NOTIFICATION',
    'UPDATE_PRICE',
    'UPDATE_STOCK',
    'AUTO_REPLY',
    'CANCEL_ORDER',
    'TAG_ORDER',
    'WEBHOOK',
  ])
  action!: string

  @IsOptional()
  conditions?: Record<string, unknown>

  @IsOptional()
  actionConfig?: Record<string, unknown>

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsString()
  schedule?: string
}

export class UpdateAutomationRuleDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  conditions?: Record<string, unknown>

  @IsOptional()
  actionConfig?: Record<string, unknown>

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsString()
  schedule?: string
}
