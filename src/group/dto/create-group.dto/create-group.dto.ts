import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({
    description: 'Name of the group',
    example: 'Adventure Enthusiasts',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'A brief description of the group (optional)',
    example: 'A group for people who enjoy outdoor activities and adventures.',
    type: 'string',
  })
  @IsString()
  @IsOptional()
  description: string;
}
