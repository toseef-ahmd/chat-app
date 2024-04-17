/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document, Types } from 'mongoose';

export enum ChatType {
  Direct = 0,
  Group = 1
}

@Schema()
export class Chat extends Document {
  @Prop({ enum: ChatType, required: true, default: ChatType.Direct })
  type: ChatType;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    // required: function () {
    //   return this.type === ChatType.Direct;
    // },
  })
  members: Array<Types.ObjectId>;

  @Prop({
    type: Array<{ type: Types.ObjectId, ref: 'Message' }>,
    default: new Array<Types.ObjectId>(),
  })
  messages: Array<ObjectId>;

  @Prop({
    type: Types.ObjectId,
    ref: 'Group',
    required: function () {
      return this.type === ChatType.Group;
    },
  })
  group: Types.ObjectId;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
export type ChatDocument = Chat & Document
