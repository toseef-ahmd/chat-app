/* eslint-disable prettier/prettier */
// user.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: any) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAllUsers();
  }

  @Get(':userID')
  findOne(@Param('userID') userID: number) {
    return this.userService.findOneUser(userID);
  }

  @Put(':userID')
  update(@Param('userID') userID: number, @Body() updateUserDto: any) {
    return this.userService.updateUser(userID, updateUserDto);
  }

  @Delete(':userID')
  remove(@Param('userID') userID: number) {
    return this.userService.removeUser(userID);
  }
}
