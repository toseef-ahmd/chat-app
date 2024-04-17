/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { ChatService } from './chat.service';
  import { CreateChatDto } from './dto/create-chat.dto/create-chat.dto';
  import { UpdateChatDto } from './dto/update-chat.dto/update-chat.dto';
  import { ApiResponse } from '../interfaces/api-response.interface';
  import { IChat } from '../interfaces/chat.interface';
  import { DeleteResult } from 'mongodb';

  
  @Controller('chats')
  export class ChatController {
    constructor(private readonly chatService: ChatService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createChatDto: CreateChatDto): Promise<ApiResponse<any>> {
      const chat = await this.chatService.create(createChatDto);
      if (!chat) {
        throw new NotFoundException('Failed to create chat');
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Chat created successfully',
        data: chat,
      };
    }
  
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<ApiResponse<Array<IChat>>> {
      const chats = await this.chatService.findAll();
      if (!chats || chats.length === 0) {
        throw new NotFoundException('No chats found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Chats fetched successfully',
        data: chats as unknown as Array<IChat>
      };
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.FOUND)
    
    async findOne(@Param('id') id: string): Promise<ApiResponse<IChat>> {

      const chat = await this.chatService.findOne(id);

      if (!chat) {
        throw new NotFoundException('Chat not found');
      }
      return {
        statusCode: HttpStatus.FOUND,
        message: 'Chat fetched successfully',
        data: chat as unknown as IChat,
      };
    }
  
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto): Promise<ApiResponse<IChat> | null> {
      const updatedChat = await this.chatService.update(id, updateChatDto);
      if (!updatedChat) {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Chat updated successfully',
        data: updatedChat as unknown as IChat,
      };
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<ApiResponse<DeleteResult> | null> {
      const result = await this.chatService.remove(id);
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Chat deleted successfully',
        data: null,
      };
    }
  
    @Delete()
    @HttpCode(HttpStatus.OK)
    async removeAll(): Promise<ApiResponse<DeleteResult>> {
      const result = await this.chatService.removeAll();
      if (result.deletedCount === 0) {
        throw new NotFoundException('No chats found to delete');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'All chats deleted successfully',
        data: null,
      };
    }
  }
  