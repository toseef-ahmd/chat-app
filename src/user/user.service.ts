/* eslint-disable prettier/prettier */
// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema'; // Correct import here

@Injectable()
export class UserService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createUser(_createUserDto: { username: string; password: string; email: string; }): any {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {} // Correct type here

  async create(createUserDto: any): Promise<User> {
    return await this.userModel.create(createUserDto);
    
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOne(userID: string): Promise<User | null> {
    return await this.userModel.findOne({ userID });
  }

  async update(userID: string, updateUserDto: any): Promise<User | null> {
    return await this.userModel
      .findOneAndUpdate({ userID }, updateUserDto, { new: true })
  }

  async remove(userID: string): Promise<any> {
    return await this.userModel.deleteOne({ userID });
  }
}
