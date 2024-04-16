/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto/update-group.dto';
import { ApiResponse } from 'src/interfaces/api-response.interface';
import { DeleteResult } from 'mongodb';
import { IGroup } from 'src/interfaces/group.interface';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGroupDto: CreateGroupDto): Promise<ApiResponse<IGroup>> {
    const group = await this.groupService.create(createGroupDto);
    if (!group) {
      throw new NotFoundException('Failed to create group');
    }
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Group created successfully',
      data: group as unknown as IGroup,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ApiResponse<IGroup[]>> {
    const groups = await this.groupService.findAll();
    if (!groups || groups.length === 0) {
      throw new NotFoundException('No groups found');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Groups fetched successfully',
      data: groups as unknown as Array<IGroup>,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.FOUND)
  async findOne(@Param('id') id: string): Promise<ApiResponse<IGroup>> {
    const group = await this.groupService.findOne(id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return {
      statusCode: HttpStatus.FOUND,
      message: 'Group fetched successfully',
      data: group as unknown as IGroup,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto): Promise<ApiResponse<IGroup>> {
    const updatedGroup = await this.groupService.update(id, updateGroupDto);
    if (!updatedGroup) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Group updated successfully',
      data: updatedGroup as unknown as IGroup,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<ApiResponse<DeleteResult>> {
    const result = await this.groupService.remove(id);
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Group deleted successfully',
      data: null,
    } as ApiResponse<DeleteResult>;
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async removeAll(): Promise<ApiResponse<DeleteResult>> {
    const result = await this.groupService.removeAll();
    if (result.deletedCount === 0) {
      throw new NotFoundException('No groups found to delete');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'All groups deleted successfully',
      data: null,
    };
  }
}
