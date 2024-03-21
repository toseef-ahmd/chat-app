/* eslint-disable prettier/prettier */
// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Injectable()
export class UserService {
constructor(@InjectModel(User.name) private userModel: Model<UserSchema>) {}

async createUser(createUserDto: any): Promise<User & Document> {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
}

async findAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
}

async findOneUser(userID: number): Promise<User | null> {
    return await this.userModel.findOne({ userID }).exec();
}

  async updateUser(userID: number, updateUserDto: any): Promise<User | null> {
    return await this.userModel.findOneAndUpdate({ userID }, updateUserDto, { new: true }).exec();
  }

  async removeUser(userID: number): Promise<any> {
    return await this.userModel.deleteOne({ userID }).exec();
  }
}
