import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { AuditActionType } from '@ecom/database'

export class AuditLogQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20

  @ApiPropertyOptional({ enum: AuditActionType })
  @IsOptional()
  @IsEnum(AuditActionType)
  action?: AuditActionType

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adminId?: string
}

export class AuditLogResponseDto {
  @ApiPropertyOptional() id!: string
  @ApiPropertyOptional() adminId!: string
  @ApiPropertyOptional({ enum: AuditActionType }) action!: AuditActionType
  @ApiPropertyOptional() entityType?: string
  @ApiPropertyOptional() entityId?: string
  @ApiPropertyOptional() metadata?: any
  @ApiPropertyOptional() ipAddress?: string
  @ApiPropertyOptional() userAgent?: string
  @ApiPropertyOptional() createdAt!: Date
  @ApiPropertyOptional() admin?: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
}
