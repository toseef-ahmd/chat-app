import { ApiProperty } from '@nestjs/swagger';

export class ConflictErrorDto {
  @ApiProperty({ example: 409, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Conflict', description: 'Error description' })
  error: string;

  @ApiProperty({
    example: ['username with value johndoe already exists'],
    description: 'Error message(s)',
    isArray: true,
  })
  message: string[];
}
