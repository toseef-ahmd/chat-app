import { IsEnum, IsArray, IsOptional, IsMongoId, ValidateIf } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ChatType } from '../../schemas/chat.schema';

export class UpdateChatDto {
  @IsOptional()
  @IsEnum(ChatType)
  type?: ChatType;

  @IsArray()
//   @IsMongoId({ each: true, message: 'Each member ID must be a valid Mongo ID' })
  members?: Array<ObjectId>;

  @IsArray()
//   @IsMongoId({
//     each: true,
//     message: 'Each message ID must be a valid Mongo ID',
//   })
  messages?: Array<ObjectId>;

//   @IsMongoId({ message: 'Group ID must be a valid Mongo ID' })
@IsMongoId()
@IsOptional()
@ValidateIf((o) => o.type === ChatType.Group)
  group?: string;
}
