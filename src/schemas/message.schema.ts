/* eslint-disable prettier/prettier */
// message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/schemas/user.schema';
 
@Schema()
export class Message extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: Types.ObjectId | User;
  
    @Prop()
    content: string;
  
    @Prop()
    createdAt: Date;
  }

export const MessageSchema = SchemaFactory.createForClass(Message);