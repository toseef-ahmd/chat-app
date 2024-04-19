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
  HttpCode
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { IUser } from '../interfaces/user.interface';
import { ApiResponse } from '../interfaces/api-response.interface';
import { DeleteResult } from 'mongodb';
import { GetHyperLinks, Methods, Routes } from '../utilities/hypermedia.utility';


@Controller('users')
// @UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<ApiResponse<IUser>> {
    const user = await this.userService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      links: GetHyperLinks(Routes.User, Methods.create),
      data: user as unknown as IUser,
    };
  }

 
  @Get()
  @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<ApiResponse<Array<IUser>>> {
    const users = await this.userService.findAll();
    if (!users) {
      throw new NotFoundException('No users found');
    }

    return {
      statusCode: HttpStatus.OK,
      message: users.length > 0 ? 'Users fetched successfully' : 'No users were found',
      links: GetHyperLinks(Routes.User, Methods.allUsers),
      data: users as unknown as Array<IUser>,
    };
  }

  @Get(':id')
    @HttpCode(HttpStatus.FOUND)
    async findOne(@Param('id') id: string) {
        const user = await this.userService.findOne(id);
        if (!user) {
          throw new NotFoundException(`User does not exist`);
        }
        return {
            statusCode: HttpStatus.FOUND,
            message: 'User fetched successfully',
            links: GetHyperLinks(Routes.User, Methods.read),
            data: user
        };
    }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ApiResponse<IUser>> {
    const user = await this.userService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      links: GetHyperLinks(Routes.User, Methods.update),
      data: user as unknown as IUser,
    } as ApiResponse<IUser>;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<ApiResponse<DeleteResult>> {
    const result = await this.userService.remove(id);
    if(result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
      links: GetHyperLinks(Routes.User, Methods.delete),
      data: null,
    } as ApiResponse<DeleteResult>;
  }

  // @Delete()
  // @HttpCode(HttpStatus.OK)
  // async removeAll(): Promise<ApiResponse<DeleteResult>> {
  //   const result = await this.userService.removeAll();
  //   if(result.deletedCount === 0) {
  //     throw new NotFoundException(`No users found`);
  //   }
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'All users deleted successfully',
  //     data: null,
  //   } as ApiResponse<DeleteResult>;
  // }
}
