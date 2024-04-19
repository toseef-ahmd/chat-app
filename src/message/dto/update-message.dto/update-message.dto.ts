import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateMessageDto } from '../create-message.dto/create-message.dto';
import { MessageStatus } from '../../schemas/message.schema';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @ApiPropertyOptional({
    description: 'Optional: New content of the message',
    example: 'Just checking in to see how things are going with the project?',
    type: String,
  })
  @IsString()
  @IsOptional()
  content?: string; // Optional: Update the message content

  @ApiPropertyOptional({
    description: 'Optional: New status of the message (read or unread)',
    example: MessageStatus.Read,
    enum: MessageStatus,
  })
  @IsEnum(MessageStatus)
  @IsOptional()
  type?: MessageStatus; // Optional: Update the message type to 'read' or 'unread'

  @ApiPropertyOptional({
    description:
      'Optional: Array of user IDs who have seen the message. Each ID must be a valid MongoDB ObjectId.',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: 'array',
    isArray: true,
  })
  @IsMongoId({ each: true })
  @IsArray()
  @ArrayUnique()
  @IsOptional()
  seenBy?: Types.ObjectId[]; // Optional: Update the array of users who have seen the message
}
