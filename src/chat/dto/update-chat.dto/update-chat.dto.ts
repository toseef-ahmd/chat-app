import {
  IsEnum,
  IsArray,
  IsOptional,
  IsMongoId,
  ValidateIf,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { ChatType } from '../../schemas/chat.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChatDto {
  @ApiPropertyOptional({
    enum: ChatType,
    description: 'Type of the chat (optional)',
    example: ChatType.Group,
  })
  @IsOptional()
  @IsEnum(ChatType)
  type?: ChatType;

  @ApiPropertyOptional({
    description: 'Array of member IDs (optional)',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    isArray: true,
    type: 'string',
  })
  @IsArray()
  // Uncomment to enforce each member ID to be a valid Mongo ID
  // @IsMongoId({ each: true, message: 'Each member ID must be a valid Mongo ID' })
  members?: Array<ObjectId>;

  @ApiPropertyOptional({
    description: 'Array of message IDs (optional)',
    example: ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014'],
    isArray: true,
    type: 'string',
  })
  @IsArray()
  // Uncomment to enforce each message ID to be a valid Mongo ID
  // @IsMongoId({
  //   each: true,
  //   message: 'Each message ID must be a valid Mongo ID',
  // })
  messages?: Array<ObjectId>;

  @ApiPropertyOptional({
    description:
      'Group ID (required only if type is Group, otherwise optional)',
    example: '507f1f77bcf86cd799439015',
    type: 'string',
  })
  @IsMongoId()
  @IsOptional()
  @ValidateIf((o) => o.type === ChatType.Group)
  group?: string;
}
