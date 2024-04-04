/* eslint-disable prettier/prettier */
// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema'; // Correct import here
import { DeleteResult } from 'mongodb';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {} // Correct type here

  async create(createUserDto: any): Promise<User> {
    try {
      return await this.userModel.create(createUserDto);
    } catch (error) {
      return error
    }
  }

  async findAll(): Promise<Array<User>> {
    try {
      return await this.userModel.find();
    } catch (error) {
      return error;
    }
    
  }

  async findOne(userID: string): Promise<User> {
    try {
      return await this.userModel.findById(userID).exec();
    } catch (error) {
      throw new Error(error);
    }
  }
  
  async update(userID: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.userModel.findByIdAndUpdate(userID, updateUserDto, { new: true }).exec();
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(userID: string): Promise<DeleteResult> {
    try {
      return await this.userModel.deleteOne({ userID });
    } catch (error) {
      return error;
    }
    
  }
}
