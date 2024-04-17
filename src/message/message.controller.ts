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
  import { MessageService } from './message.service';
  import { CreateMessageDto } from './dto/create-message.dto/create-message.dto';
  import { UpdateMessageDto } from './dto/update-message.dto/update-message.dto';
  import { ApiResponse } from '../interfaces/api-response.interface';
  import { DeleteResult } from 'mongodb';
  import { IMessage } from '../interfaces/message.interface';
  
  @Controller('messages')
  export class MessageController {
    constructor(private readonly messageService: MessageService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createMessageDto: CreateMessageDto): Promise<ApiResponse<IMessage>> {
      const message = await this.messageService.create(createMessageDto);
      if (!message) {
        throw new NotFoundException('Failed to create message');
      }
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Message created successfully',
        data: message as unknown as IMessage,
      };
    }
  
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<ApiResponse<IMessage[]>> {
      const messages = await this.messageService.findAll();
      if (!messages || messages.length === 0) {
        throw new NotFoundException('No messages found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Messages fetched successfully',
        data: messages as unknown as Array<IMessage>,
      };
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.FOUND)
    async findOne(@Param('id') id: string): Promise<ApiResponse<IMessage>> {
      const message = await this.messageService.findOne(id);
      if (!message) {
        throw new NotFoundException('Message not found');
      }
      return {
        statusCode: HttpStatus.FOUND,
        message: 'Message fetched successfully',
        data: message as unknown as IMessage,
      };
    }
  
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto): Promise<ApiResponse<IMessage>> {
      const updatedMessage = await this.messageService.update(id, updateMessageDto);
      if (!updatedMessage) {
        throw new NotFoundException(`Message with ID ${id} not found`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Message updated successfully',
        data: updatedMessage as unknown as IMessage,
      };
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<ApiResponse<DeleteResult>> {
      const result = await this.messageService.remove(id);
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Message with ID ${id} not found`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Message deleted successfully',
        data: null,
      };
    }
  
    @Delete()
    @HttpCode(HttpStatus.OK)
    async removeAll(): Promise<ApiResponse<DeleteResult>> {
      const result = await this.messageService.removeAll();
      if (result.deletedCount === 0) {
        throw new NotFoundException('No messages found to delete');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'All messages deleted successfully',
        data: null,
      };
    }
  }
  