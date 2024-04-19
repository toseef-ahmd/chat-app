/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export enum MessageStatus {
  Unread = 0,
  Read = 1,
}
@Schema()
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  sender: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  sentAt: Date;

  @Prop({
    type: Number,
    enum: MessageStatus,
    default: MessageStatus.Unread,
  })
  type: MessageStatus;

  @Prop({ type: Array<{ type: Types.ObjectId, ref: 'User' }>, default: [] })
  seenBy: Array<Types.ObjectId>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
export type MessageDocument = Message & Document;
