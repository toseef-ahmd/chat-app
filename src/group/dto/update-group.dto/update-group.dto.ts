import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../../user/schemas/user.schema';

export class UpdateGroupDto {
  @ApiPropertyOptional({
    description: 'The new name of the group (optional)',
    example: 'Adventure Enthusiasts',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description:
      'List of updated members of the group (optional). Each member should be an existing User object.',
    isArray: true,
    example: ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014'],
    type: () => Array<User>,
  })
  @IsOptional()
  members?: Array<User>;

  @ApiPropertyOptional({
    description: 'A new description of the group (optional)',
    example:
      'A group for those interested in outdoor adventures and nature walks.',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
