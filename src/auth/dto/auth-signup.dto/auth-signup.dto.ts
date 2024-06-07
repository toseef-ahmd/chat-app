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

class SelfLinkDto {
  @ApiProperty({
    example: '/auth/signup',
    description: 'The URL of the self link',
  })
  href: string;

  @ApiProperty({
    example: 'POST',
    description: 'The HTTP method of the self link',
  })
  method: string;
}

class LoginLinkDto {
  @ApiProperty({
    example: '/auth/login',
    description: 'The URL of the login link',
  })
  href: string;

  @ApiProperty({
    example: 'POST',
    description: 'The HTTP method of the login link',
  })
  method: string;
}

class LinkDto {
  @ApiProperty({ type: () => SelfLinkDto, description: 'Self link details' })
  self: SelfLinkDto;

  @ApiProperty({ type: () => LoginLinkDto, description: 'Login link details' })
  login: LoginLinkDto;
}

export class UserCreateResponseDto {
  @ApiProperty({ example: 201, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: 'User created successfully',
    description: 'Message indicating the result of the operation',
  })
  message: string;

  @ApiProperty({
    type: () => [LinkDto],
    isArray: true,
    description: 'Hypermedia links related to the operation',
  })
  links: LinkDto[];

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5kb2UzIiwic3ViIjoiNjY2MzhmMjU2MWZmMzk5MzAyNTQyODJjIiwiaWF0IjoxNzE3ODAwNzQxLCJleHAiOjE3MTc4MDc5NDF9.ynh-Hprm5Sboi8jIoLiBpsEPDFllh2Q6XNbLmIaYIBc',
    description: 'JWT token for the created user',
  })
  data: string;
}
