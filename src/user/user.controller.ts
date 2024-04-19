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
  HttpCode,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { IUser } from 'src/interfaces/user.interface';
import { ApiResponse } from 'src/interfaces/api-response.interface';
import { DeleteResult } from 'mongodb';
import { AuthGuard } from '@nestjs/passport';


@Controller('user')
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
      message: 'Users fetched successfully',
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
            data: user
        };
    }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('userID') userID: string, @Body() updateUserDto: UpdateUserDto): Promise<ApiResponse<IUser>> {
    const user = await this.userService.update(userID, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User does not exist`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: user as unknown as IUser,
    } as ApiResponse<IUser>;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('userID') userID: string): Promise<ApiResponse<DeleteResult>> {
    const result = await this.userService.remove(userID);
    if(result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${userID} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
      data: null,
    } as ApiResponse<DeleteResult>;
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async removeAll(): Promise<ApiResponse<DeleteResult>> {
    const result = await this.userService.removeAll();
    if(result.deletedCount === 0) {
      throw new NotFoundException(`No users found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'All users deleted successfully',
      data: null,
    } as ApiResponse<DeleteResult>;
  }
}
