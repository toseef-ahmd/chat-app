/* eslint-disable prettier/prettier */
// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema'; // Correct import here

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {} // Correct type here

  async createUser(createUserDto: any): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOneUser(userID: string): Promise<User | null> {
    return await this.userModel.findOne({ userID });
  }

  async updateUser(userID: string, updateUserDto: any): Promise<User | null> {
    return await this.userModel
      .findOneAndUpdate({ userID }, updateUserDto, { new: true })
  }

  async removeUser(userID: string): Promise<any> {
    return await this.userModel.deleteOne({ userID });
  }
}
