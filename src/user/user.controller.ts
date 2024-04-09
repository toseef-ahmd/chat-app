/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  NotFoundException,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { IUser } from 'src/interfaces/user.interface';
import { ApiResponse } from 'src/interfaces/api-response.interface';
import { DeleteResult } from 'mongodb';
import { AuthGuard } from '@nestjs/passport';
import { User } from './schemas/user.schema';

@Controller('users')
// @UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<IUser>> {
    const user = await this.userService.create(createUserDto);
    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user as unknown as IUser,
    };
  }

 
  @Get()
  // @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<ApiResponse<Array<User>>> {
    const users = await this.userService.findAll();
    return {
      status: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: users ,
    };
  }

  @Get(':userID')
  async findOne(@Param('userID') userID: string): Promise<ApiResponse<IUser>> {
    const user = await this.userService.findOne(userID);
    return {
      status: HttpStatus.OK,
      message: 'User fetched successfully',
      data: user as unknown as IUser,
    };
  }

  @Put(':userID')
  async update(@Param('userID') userID: string, @Body() updateUserDto: UpdateUserDto): Promise<ApiResponse<IUser>> {
    const user = await this.userService.update(userID, updateUserDto);
    return {
      status: HttpStatus.OK,
      message: 'User updated successfully',
      data: user as unknown as IUser,
    } as ApiResponse<IUser>;
  }

  @Delete(':userID')
  async remove(@Param('userID') userID: string): Promise<ApiResponse<DeleteResult>> {
    const result = await this.userService.remove(userID);
    if(result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${userID} not found`);
    }
    return {
      status: HttpStatus.OK,
      message: 'User deleted successfully',
      data: null,
    } as ApiResponse<DeleteResult>;
  }
}
