// create-user.dto.ts
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDTO {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: 'Username for the user account',
    example: 'johndoe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    description: 'Password for securing the user account',
    example: 'pass1234',
    required: true,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
