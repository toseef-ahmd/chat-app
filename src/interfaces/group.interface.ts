import { Document } from 'mongoose';
import { IUser } from './user.interface';

export interface IGroup extends Document {
  name: string;
  owner: IUser; 
  members: IUser[];
}
