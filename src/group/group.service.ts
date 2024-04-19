import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto/update-group.dto';
import { DeleteResult, ObjectId } from 'mongodb';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const createdGroup = await this.groupModel.create(createGroupDto);
    if (!createdGroup) {
      throw new BadRequestException('Failed to create group');
    }
    return createdGroup;
  }

  async findAll(): Promise<Array<Group>> {
    const res = await this.groupModel.find().exec();
    return res; // No longer throw if no groups, return empty array
  }

  async findOne(groupId: string): Promise<Group | null> {
    const group = await this.groupModel.findById(groupId).exec();
    return group || null; // Return null instead of throwing if not found
  }

  async update(
    groupId: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group | null> {
    const updatedGroup = await this.groupModel
      .findByIdAndUpdate(groupId, updateGroupDto, { new: true })
      .exec();
    return updatedGroup || null; // Return null instead of throwing if not found
  }

  async remove(groupId: string): Promise<DeleteResult> {
    const result = await this.groupModel.deleteOne({ _id: groupId });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }
    return result;
  }

  async removeAll(): Promise<DeleteResult> {
    // await this.groupModel.dropSearchIndex('groupName_1');
    return await this.groupModel.deleteMany({});
  }
}
