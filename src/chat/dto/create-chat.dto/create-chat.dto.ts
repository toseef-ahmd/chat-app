import {
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  IsArray,
  ArrayNotEmpty,
  IsMongoId,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { MessageStatus } from '../../../message/schemas/message.schema';
import { ChatType } from '../../schemas/chat.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    enum: ChatType,
    description: 'Type of the chat',
    required: true,
  })
  @IsEnum(ChatType)
  @IsNotEmpty()
  type: ChatType;

  @ApiProperty({
    description: 'Array of member IDs',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    isArray: true,
    type: 'string',
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  members: Array<ObjectId>;

  @ApiProperty({
    description: 'Array of message IDs',
    example: ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014'],
    isArray: true,
    type: 'string',
  })
  @IsArray()
  messages: Array<ObjectId>;

  @ApiProperty({
    description: 'Group ID, required only for group chat types',
    example: '507f1f77bcf86cd799439015',
    type: 'string',
    required: false,
  })
  @IsMongoId()
  @ValidateIf((o) => o.type === ChatType.Group)
  group: string;
}
