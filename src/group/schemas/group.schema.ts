/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema()
export class Group extends Document {
  @Prop({ required: true })
  groupName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: Types.ObjectId[] | User[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId | User;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  groupDescription?: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
