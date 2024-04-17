/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export enum MessageType {
  Unread = 0,
  Read = 1,
}
@Schema()
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  sentAt: Date;

  @Prop({
    type: Number,
    enum: MessageType,
    default: MessageType.Unread,
  })
  type: MessageType;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seenBy: Array<Types.ObjectId>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
export type MessageDocument = Message & Document;
