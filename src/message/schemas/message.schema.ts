/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  sentAt: Date;

  @Prop({ enum: ['read', 'unread'], required: true, default: 'unread'})
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seenBy: Types.ObjectId[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
