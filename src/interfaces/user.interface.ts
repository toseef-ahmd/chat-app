// user.interface.ts
import { UserStatus } from '../user/schemas/user.schema';
import { Types } from 'mongoose';

export interface IUser extends Document {
  _id?: Types.ObjectId;
  username: string;
  // password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  status?: UserStatus;
  friends?: Array<Types.ObjectId>;
}
