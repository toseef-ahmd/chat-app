import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
    format: 'email',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'securePassword123',
    type: 'string',
    required: true,
  })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
class SelfLinkDto {
  @ApiProperty({
    example: '/auth/login',
    description: 'The URL of the self link',
  })
  href: string;

  @ApiProperty({
    example: 'POST',
    description: 'The HTTP method of the self link',
  })
  method: string;
}

class LinkDto {
  @ApiProperty({ type: () => SelfLinkDto, description: 'Self link details' })
  self: SelfLinkDto;
}
export class LoginResponseDto {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: 'User logged in successfully',
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
    description: 'JWT token for the logged-in user',
  })
  data: string;
}
