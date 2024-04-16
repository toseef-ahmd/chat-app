import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './schemas/group.schema'; // Ensure you have GroupDocument if using TypeScript
import { CreateGroupDto } from './dto/create-group/create-group';
import { UpdateGroupDto } from './dto/update-group/update-group';
import { DeleteResult } from 'mongodb';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const createdGroup = await this.groupModel.create(createGroupDto);
    if (!createdGroup) {
      throw new NotFoundException('Failed to create group');
    }
    return createdGroup;
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async findById(groupId: string): Promise<Group | null> {
    const group = await this.groupModel.findById(groupId).exec();
    return group || null;
  }

  async update(
    groupId: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group | null> {
    const updatedGroup = await this.groupModel
      .findByIdAndUpdate(groupId, updateGroupDto, { new: true })
      .exec();
    return updatedGroup || null;
  }

  async remove(groupId: string): Promise<DeleteResult> {
    const result = await this.groupModel.deleteOne({ _id: groupId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }
    return result;
  }

  async removeAll(): Promise<DeleteResult> {
    return this.groupModel.deleteMany({});
  }
}
