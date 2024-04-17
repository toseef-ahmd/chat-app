import { Types } from 'mongoose';
import { MessageType } from 'src/message/schemas/message.schema';

export interface IChat {
  _id?: Types.ObjectId;
  type: MessageType;
  members?: Array<Types.ObjectId>;
  messages: Array<Types.ObjectId>;
  group?: Types.ObjectId;
}
