import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { CreateChatDto } from './dto/create-chat.dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto/update-chat.dto';
import { DeleteResult } from 'mongodb';
import { Message, MessageDocument } from 'src/message/schemas/message.schema';
import { CreateMessageDto } from 'src/message/dto/create-message.dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const createdChat = await this.chatModel.create(createChatDto);
    if (!createdChat) {
      throw new BadRequestException('Failed to create chat');
    }
    return createdChat;
  }

  async findAll(): Promise<Array<Chat>> {
    return this.chatModel.find().populate({
      path: 'members',
      model: 'User', // The name of the User model
      select: 'username', // Only populate the username field
    }).exec();
  }

  async findOne(chatId: string): Promise<Chat | null> {
    const chat = await this.chatModel
      .findById(chatId)
      .populate({
        path: 'messages',
        model: 'Message',
      })
      .exec();

    return chat || null;
  }

  async update(
    chatId: string,
    updateChatDto: UpdateChatDto,
  ): Promise<Chat | null> {
    const updatedChat = await this.chatModel
      .findByIdAndUpdate(chatId, updateChatDto, { new: true })
      .exec();
    return updatedChat || null;
  }

  async remove(chatId: string): Promise<DeleteResult> {
    const result = await this.chatModel.deleteOne({ _id: chatId });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Message with ID ${chatId} not found`);
    }
    return result;
  }

  async addMessageToChat(
    chatId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<Message> {
    const message = new this.messageModel(createMessageDto);
    await message.save();

    const chat = await this.chatModel.findById(chatId);

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    chat.messages.push(message._id);
    chat.markModified('messages');

    await chat.save();

    return message;
  }

  async removeAll(): Promise<DeleteResult | null> {
    const result = await this.chatModel.deleteMany({});
    // if (result.deletedCount === 0) {
    //   throw new NotFoundException('No chats found to delete');
    // }
    return result;
  }
}
