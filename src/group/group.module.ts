/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from '../group/schemas/group.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])
      ],
    controllers: [], 
    providers: [],
    exports: []
})
export class GroupModule {}
