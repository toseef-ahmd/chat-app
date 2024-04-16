import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsMongoId,
  IsArray,
  IsOptional,
  ArrayUnique,
} from 'class-validator';
import { Types } from 'mongoose';

export enum MessageType {
  Read = 'read',
  Unread = 'unread',
}

export class CreateMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  sender: Types.ObjectId; // Assuming sender must be a valid MongoDB ObjectId referring to a User

  @IsString()
  @IsNotEmpty()
  content: string; // The actual message content, must be a non-empty string

}
