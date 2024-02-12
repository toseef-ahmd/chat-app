/* eslint-disable prettier/prettier */
// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

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
    enum: ['online', 'offline', 'typing'],
    required: true,
    default: 'offline',
  })
  status: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  friends: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
