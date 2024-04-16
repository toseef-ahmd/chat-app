import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { Types } from 'mongoose';
import {
  CreateMessageDto,
  MessageType,
} from '../create-message.dto/create-message.dto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @IsString()
  @IsOptional()
  content?: string; // Optional: Update the message content

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType; // Optional: Update the message type to 'read' or 'unread'

  @IsMongoId({ each: true })
  @IsArray()
  @ArrayUnique()
  @IsOptional()
  seenBy?: Types.ObjectId[]; // Optional: Update the array of users who have seen the message
}
