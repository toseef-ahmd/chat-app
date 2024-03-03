import { Document } from 'mongoose';
import { User } from './user.interface';
import { IGroup } from './group.interface';

export interface IMessage extends Document {
  content: string;
  sender: User; 
  receiver?: User; 
  group?: IGroup;
}
