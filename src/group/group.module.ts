/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from '../group/schemas/group.schema';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])
      ],
    controllers: [GroupController], 
    providers: [GroupService],
    exports: []
})
export class GroupModule {}
