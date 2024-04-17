import { Document } from 'mongoose';
import { IUser } from './user.interface';
import { IGroup } from './group.interface';
import { MessageType } from 'src/message/schemas/message.schema';

export interface IMessage extends Document {
  content: string;
  sender: IUser;
  receiver?: IUser;
  type: MessageType;
  group?: IGroup;
  seenBy?: Array<IUser>;
}
