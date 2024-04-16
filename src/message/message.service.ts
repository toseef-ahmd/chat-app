import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto/update-message.dto';
import { DeleteResult, ObjectId } from 'mongodb';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const createdMessage = await this.messageModel.create(createMessageDto);
    if (!createdMessage) {
      throw new BadRequestException('Failed to create message');
    }
    return createdMessage;
  }

  async findAll(): Promise<Array<Message>> {
    const messages = await this.messageModel.find().exec();
    return messages; // No longer throw if no messages, return empty array
  }

  async findOne(messageId: string): Promise<Message | null> {
    const message = await this.messageModel.findById(messageId).exec();
    return message || null; // Return null instead of throwing if not found
  }

  async update(
    messageId: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message | null> {
    const updatedMessage = await this.messageModel
      .findByIdAndUpdate(messageId, updateMessageDto, { new: true })
      .exec();

    return updatedMessage || null;
  }

  async remove(messageId: string): Promise<DeleteResult> {
    const result = await this.messageModel.deleteOne({
      _id: messageId,
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }
    return result;
  }

  async removeAll(): Promise<DeleteResult> {
    return await this.messageModel.deleteMany({});
  }
}
