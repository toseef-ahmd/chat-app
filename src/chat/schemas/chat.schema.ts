/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Chat extends Document {
  @Prop({ enum: ['direct', 'group'], required: true })
  type: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: function () {
      return this.type === 'direct';
    },
  })
  members: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Message' }],
    default: [],
  })
  messages: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Group',
    required: function () {
      return this.type === 'group';
    },
  })
  group: Types.ObjectId;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
