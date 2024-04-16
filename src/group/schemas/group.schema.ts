/* eslint-disable prettier/prettier */
// group.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export enum GroupStatus {
  Inactive = 0,
  Active = 1,
}

@Schema()
export class Group {
  @Prop({ required: true, unique: true }) // Assuming groupName should be unique
  name: string;

  @Prop({ type: Array<{ type: Types.ObjectId, ref: 'User' }>, default: [] })
  members: Array<Types.ObjectId> | Array<User>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId | User;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: GroupStatus.Active, enum: GroupStatus })
  status: GroupStatus;

  @Prop()
  description?: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
export type GroupDocument = Group & Document;
