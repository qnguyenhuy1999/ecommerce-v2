import { IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ description: 'User email address', format: 'email', example: 'admin@example.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ description: 'User password', format: 'password' })
  @IsString()
  password!: string
}
