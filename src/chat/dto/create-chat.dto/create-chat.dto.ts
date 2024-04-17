import {
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  IsArray,
  ArrayNotEmpty,
  IsMongoId,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { MessageType } from '../../../message/schemas/message.schema';
import { ChatType } from '../../schemas/chat.schema';

export class CreateChatDto {
  @IsEnum(MessageType)
  @IsNotEmpty()
  type: ChatType;

  @IsArray()
  @ArrayNotEmpty()
  members: Array<ObjectId>;

  @IsArray()
  messages: Array<ObjectId>;

  @IsMongoId()
  @ValidateIf((o) => o.type === ChatType.Group)
  group: string;
}
