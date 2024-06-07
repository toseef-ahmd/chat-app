import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedErrorDto {
  @ApiProperty({ example: 401, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized', description: 'Error description' })
  error: string;

  @ApiProperty({
    example: ['Invalid Email or Password'],
    description: 'Error message(s)',
    isArray: true,
  })
  message: string[];
}
