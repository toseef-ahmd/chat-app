import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto/create-chat.dto';
import { ObjectId } from 'mongodb';
import { ChatType } from './schemas/chat.schema';

describe('ChatController Functions Tests', () => {
  let controller: ChatController;

  const mockChatService = {
    create: jest.fn((dto) => ({
      _id: 'unique-chat-id',
      ...dto,
    })),
    findAll: jest.fn(() => [
      { _id: 'unique-chat-id1', type: 'group', group: new ObjectId() },
      {
        _id: 'unique-chat-id2',
        type: 'direct',
        members: [new ObjectId(), new ObjectId()],
      },
    ]),
    findOne: jest.fn((id) => {
      if (id === 'existing-id') {
        return { _id: id, type: 'direct', members: [new ObjectId()] };
      } else {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }
    }),
    update: jest.fn((id, dto) => {
      if (id === 'unique-chat-id') {
        return { _id: id, ...dto };
      } else {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }
    }),
    remove: jest.fn((id) => {
      if (id === 'existing-id') {
        return { deletedCount: 1 };
      } else {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }
    }),
    removeAll: jest.fn(() => ({
      deletedCount: 2,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [ChatService],
    })
      .overrideProvider(ChatService)
      .useValue(mockChatService)
      .compile();

    controller = module.get<ChatController>(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Chat - Create', () => {
    it('should create a new chat', async () => {
      const dto: CreateChatDto = {
        type: ChatType.Group,
        group: new ObjectId().toString(),
        members: [new ObjectId(), new ObjectId()],
        messages: [new ObjectId(), new ObjectId()],
      };
      expect(await controller.create(dto)).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Chat created successfully',
        data: { _id: expect.any(String), ...dto },
      });
      expect(mockChatService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('Chat - FindAll', () => {
    it('should fetch all chats', async () => {
      expect(await controller.findAll()).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Chats fetched successfully',
        data: [
          {
            _id: 'unique-chat-id1',
            type: 'group',
            group: expect.any(ObjectId),
          },
          {
            _id: 'unique-chat-id2',
            type: 'direct',
            members: expect.any(Array),
          },
        ],
      });
      expect(mockChatService.findAll).toHaveBeenCalled();
    });
  });

  describe('Chat - FindOne', () => {
    it('should fetch a single chat by ID', async () => {
      const chatId = 'existing-id';
      expect(await controller.findOne(chatId)).toEqual({
        statusCode: HttpStatus.FOUND,
        message: 'Chat fetched successfully',
        data: { _id: chatId, type: 'direct', members: expect.any(Array) },
      });
      expect(mockChatService.findOne).toHaveBeenCalledWith(chatId);
    });

    it('should throw a not found exception when chat does not exist', async () => {
      const chatId = 'non-existing-id';
      await expect(controller.findOne(chatId)).rejects.toThrow(
        new NotFoundException(`Chat with ID ${chatId} not found`),
      );
    });
  });

  describe('Chat - Update', () => {
    it('should update a chat', async () => {
      const dto = { type: ChatType.Direct, members: [new ObjectId()] };
      const chatId = 'unique-chat-id';
      expect(await controller.update(chatId, dto)).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Chat updated successfully',
        data: { _id: chatId, ...dto },
      });
      expect(mockChatService.update).toHaveBeenCalledWith(chatId, dto);
    });

    it('should throw a not found exception when trying to update a non-existing chat', async () => {
      const chatId = 'non-existing-id';
      await expect(controller.update(chatId, {})).rejects.toThrow(
        new NotFoundException(`Chat with ID ${chatId} not found`),
      );
    });
  });

  describe('Chat - Remove', () => {
    it('should delete a chat and return success', async () => {
      const chatId = 'existing-id';

      const result = await controller.remove(chatId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Chat deleted successfully',
        data: null,
      });
      expect(mockChatService.remove).toHaveBeenCalledWith(chatId);
    });

    it('should throw a not found exception when trying to delete a non-existing chat', async () => {
      const chatId = 'invalid-id';
      await expect(controller.remove(chatId)).rejects.toThrow(
        new NotFoundException(`Chat with ID ${chatId} not found`),
      );
    });
  });

  describe('Chat - RemoveAll', () => {
    it('should delete all chats and return success', async () => {
      expect(await controller.removeAll()).toEqual({
        statusCode: HttpStatus.OK,
        message: 'All chats deleted successfully',
        data: null,
      });
      expect(mockChatService.removeAll).toHaveBeenCalled();
    });

    it('should throw a not found exception when there are no chats to delete', async () => {
      mockChatService.removeAll.mockReturnValueOnce({ deletedCount: 0 });
      await expect(controller.removeAll()).rejects.toThrow(
        new NotFoundException('No chats found to delete'),
      );
    });
  });
});
