import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator'

export class CreateWarehouseDto {
  @IsString()
  @MaxLength(200)
  name!: string

  @IsString()
  @MaxLength(50)
  code!: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean
}
