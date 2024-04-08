import { Document } from 'mongoose';
import { IUser } from './user.interface';
import { IGroup } from './group.interface';

export interface IMessage extends Document {
  content: string;
  sender: IUser;
  receiver?: IUser;
  group?: IGroup;
}
