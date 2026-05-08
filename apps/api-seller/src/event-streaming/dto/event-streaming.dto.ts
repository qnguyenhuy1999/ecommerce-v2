import { IsString, IsOptional } from 'class-validator'

export class EmitEventDto {
  @IsString()
  eventType!: string

  @IsString()
  source!: string

  @IsOptional()
  payload?: Record<string, unknown>

  @IsOptional()
  metadata?: Record<string, unknown>
}

export class CreateEventSubscriptionDto {
  @IsString()
  eventType!: string

  @IsString()
  webhookUrl!: string

  @IsOptional()
  @IsString()
  secret?: string
}
