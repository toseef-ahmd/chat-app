import { Document } from 'mongoose';

export interface User extends Document {
  username: string;
  password: string; // Store hashed passwords only
  email: string;
  profile: UserProfile;
  friends: User[];
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  avatar: string; // URL to the avatar image
}
