import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { DeleteResult } from 'mongodb';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    
    return user || null;
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userModel.create(createUserDto);

    console.log(createdUser);
    if (!createdUser) {
      throw new NotFoundException('Failed to create user');
    }
    return createdUser;
  }

  async findAll(): Promise<Array<User>> {
    const users = await this.userModel.find().exec();
    return users; // No longer throw if no users, return empty array
  }

  async findOne(userID: string): Promise<User | null> {
    const user = await this.userModel.findById(userID).exec();
    return user || null; // Return null instead of throwing if not found
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username }).exec();
    return user || null; // Return null instead of throwing if not found
  }

  async update(
    userID: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userID, updateUserDto, { new: true })
      .exec();
    return updatedUser || null; // Return null instead of throwing if not found
  }

  async remove(userID: string): Promise<DeleteResult> {
    const result = await this.userModel.deleteOne({ _id: userID });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${userID} not found`);
    }
    return result;
  }

  async removeAll(): Promise<DeleteResult> {
    return await this.userModel.deleteMany({});
  }
}
