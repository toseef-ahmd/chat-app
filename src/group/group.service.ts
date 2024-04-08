import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from './schemas/group.schema';
import { createGroupDto } from './dto/CreateGroup.dto';
import { getGroupDto } from './dto/GetGroup.dto';
@Injectable()
export class GroupService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  createGroup(createGroupDto: createGroupDto) {
    const newGroup = new this.groupModel(createGroupDto);
    return newGroup.save();
  }

  async getGroup() {
    return this.groupModel.find();
  }

  getGroupById(id: string) {
    return this.groupModel.findById(id);
  }
}
