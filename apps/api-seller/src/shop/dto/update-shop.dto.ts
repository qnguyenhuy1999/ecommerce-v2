import { IsOptional, IsString, MaxLength, IsEmail, IsUrl } from 'class-validator'

export class UpdateShopDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsUrl()
  logo?: string

  @IsOptional()
  @IsUrl()
  banner?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  addressLine1?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  addressLine2?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string

  @IsOptional()
  @IsString()
  @MaxLength(2)
  country?: string
}
