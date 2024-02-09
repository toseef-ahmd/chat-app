// group.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { IGroup } from 'src/interfaces/group.interface';}

export type GroupDocument = Document & IGroup; // Assuming IGroup interface is defined elsewhere

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  members: Types.Array<User>;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
