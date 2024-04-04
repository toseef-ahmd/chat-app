import { Document } from 'mongoose';
import { User } from './user.interface';

export interface IGroup extends Document {
  name: string;
  owner: User; 
  members: User[];
}
