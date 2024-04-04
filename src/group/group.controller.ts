import { createGroupDto } from './dto/CreateGroup.dto';
import { getGroupDto } from './dto/GetGroup.dto';
import { GroupService } from './group.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('group') // api
export class GroupController {
  constructor(private GroupService: GroupService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createGroup(@Body() createGroupDto: createGroupDto) {
    console.log(createGroupDto);
    return this.GroupService.createGroup(createGroupDto);
  }

  @Get()
  getGroup() {
    return this.GroupService.getGroup();
  }

  @Get(':id')
  async getGroupById(@Param('id') id: string) {
    const findGroup = await this.GroupService.getGroupById(id);
    if (!findGroup) throw new HttpException('Group not found', 404);
    return findGroup;
  }
}
