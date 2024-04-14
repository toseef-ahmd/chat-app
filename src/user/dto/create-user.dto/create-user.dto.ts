/* eslint-disable prettier/prettier */
// create-user.dto.ts
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;
}
