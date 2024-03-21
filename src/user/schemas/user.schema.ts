/* eslint-disable prettier/prettier */
// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


// user-status.enum.ts
export enum UserStatus {
  Offline = 0,
  Online = 1,
  Typing = 2,
}


@Schema()
export class User extends Document {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  avatar: string;

  @Prop({
    enum: UserStatus,
    required: true,
    default: UserStatus.Offline,
  })
  status: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  friends: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
