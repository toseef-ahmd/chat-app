// create-user.dto.ts
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'johndoe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'Secure*1234',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
