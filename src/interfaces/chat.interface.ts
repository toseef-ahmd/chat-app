import { Types } from 'mongoose';
import { MessageStatus } from 'src/message/schemas/message.schema';

export interface IChat {
  _id?: Types.ObjectId;
  type: MessageStatus;
  members?: Array<Types.ObjectId>;
  messages: Array<Types.ObjectId>;
  group?: Types.ObjectId;
}
