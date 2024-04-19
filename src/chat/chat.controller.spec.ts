import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto/create-chat.dto';
import { ObjectId } from 'mongodb';
import { ChatType } from './schemas/chat.schema';
import { UpdateChatDto } from './dto/update-chat.dto/update-chat.dto';

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

  describe('create', () => {
    it('should successfully create a chat', async () => {
      const dto: CreateChatDto = {
        type: ChatType.Group,
        group: new ObjectId().toString(),
        members: [],
        messages: [],
      };
      const responseValue = {
        _id: 'unique-chat-id',
        ...dto,
      };
      mockChatService.create.mockResolvedValue(responseValue);

      const result = await controller.create(dto);

      expect(mockChatService.create).toHaveBeenCalledWith(dto);
      expect(result.statusCode).toEqual(HttpStatus.CREATED);
      expect(result.message).toEqual('Chat created successfully');
      expect(result.data).toEqual(responseValue);
      expect(result.links).toBeDefined();

    });

    it('should throw a NotFoundException when chat creation fails', async () => {
      const dto: CreateChatDto = {
        type: ChatType.Group,
        group: new ObjectId().toString(),
        members: [],
        messages: [],
      };
      mockChatService.create.mockResolvedValue(null);

      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when service returns null', async () => {
      const dto: CreateChatDto = {
        type: ChatType.Group,
        group: new ObjectId().toString(),
        members: [],
        messages: [],
      };
      mockChatService.create.mockResolvedValueOnce(null);
      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of chats', async () => {
      const chatArray = [
        {
          _id: 'unique-chat-id1',
          type: 'group',
          group: new ObjectId().toString(),
          members: [],
          messages: [],
        },
        {
          _id: 'unique-chat-id2',
          type: 'direct',
          members: [new ObjectId().toString()],
          messages: [],
        },
      ];
      mockChatService.findAll.mockResolvedValueOnce(chatArray as never);

      const result = await controller.findAll();
      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('Chats fetched successfully');
      expect(result.data).toEqual(chatArray);
      expect(result.links).toBeDefined();
      expect(mockChatService.findAll).toHaveBeenCalled();
    });

    it('should throw a NotFoundException when no chats are found', async () => {
      mockChatService.findAll.mockResolvedValue([] as never);

      await expect(controller.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('Chat - FindOne', () => {
    it('should fetch a single chat by ID', async () => {
      const chatId = 'existing-id';

      const result = await controller.findOne(chatId);

      expect(result.statusCode).toEqual(HttpStatus.FOUND);
      expect(result.message).toEqual('Chat fetched successfully');
      expect(result.data).toEqual({
        _id: chatId,
        type: 'direct',
        members: expect.any(Array),
      });
      expect(result.links).toBeDefined();

      expect(mockChatService.findOne).toHaveBeenCalledWith(chatId);
    });

    it('should throw a not found exception when chat does not exist', async () => {
      const chatId = 'non-existing-id';
      await expect(controller.findOne(chatId)).rejects.toThrow(
        new NotFoundException(`Chat with ID ${chatId} not found`),
      );
    });

    it('should throw NotFoundException when chat to update is not found', async () => {
      const chatId = new ObjectId().toString();
      mockChatService.findOne.mockResolvedValueOnce(null as never);
      await expect(controller.findOne(chatId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Chat - Update', () => {
    it('should update a chat', async () => {
      const dto = { type: ChatType.Direct, members: [new ObjectId()] };
      const chatId = 'unique-chat-id';

      const result = await controller.update(chatId, dto);
      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('Chat updated successfully');
      expect(result.links).toBeDefined();
      expect(result.data).toEqual({ _id: chatId, ...dto });

      expect(mockChatService.update).toHaveBeenCalledWith(chatId, dto);
    });

    it('should throw a not found exception when trying to update a non-existing chat', async () => {
      const chatId = 'non-existing-id';
      await expect(controller.update(chatId, {})).rejects.toThrow(
        new NotFoundException(`Chat with ID ${chatId} not found`),
      );
    });

    it('should throw an exception when chat updating fails', async () => {
      const chatId = 'non-existent-id';
      const updateChatDto: UpdateChatDto = { type: ChatType.Direct };
      mockChatService.update.mockRejectedValue(
        new NotFoundException('Chat not found'),
      );

      await expect(controller.update(chatId, updateChatDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when chat to update is not found', async () => {
      const chatId = new ObjectId().toString();
      const updateChatDto: UpdateChatDto = { type: ChatType.Direct };
      mockChatService.update.mockResolvedValueOnce(null);
      await expect(controller.update(chatId, updateChatDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Chat - Remove', () => {
    it('should delete a chat and return success', async () => {
      const chatId = 'existing-id';

      const result = await controller.remove(chatId);

      expect(result.statusCode).toEqual(200);
      expect(result.message).toEqual('Chat deleted successfully');
      expect(result.data).toBe(null);
      expect(result.links).toBeDefined();

      expect(mockChatService.remove).toHaveBeenCalledWith(chatId);
    });

    it('should throw a not found exception when trying to delete a non-existing chat', async () => {
      const chatId = 'invalid-id';
      await expect(controller.remove(chatId)).rejects.toThrow(
        new NotFoundException(`Chat with ID ${chatId} not found`),
      );
    });

    it('should throw NotFoundException when chat to remove is not found', async () => {
      const chatId = new ObjectId().toString();
      const updateChatDto: UpdateChatDto = { type: ChatType.Direct };
      mockChatService.update.mockResolvedValueOnce(null);
      await expect(controller.update(chatId, updateChatDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException when no chat is deleted', async () => {
      const chatId = new ObjectId().toString(); // or 'non-existing-id'
      mockChatService.remove.mockResolvedValueOnce({
        deletedCount: 0,
      } as never);

      await expect(controller.remove(chatId)).rejects.toThrow(
        new NotFoundException(`Chat with ID ${chatId} not found`),
      );
      expect(mockChatService.remove).toHaveBeenCalledWith(chatId);
    });
  });

  // describe('Chat - RemoveAll', () => {
  //   it('should delete all chats and return success', async () => {
  //     expect(await controller.removeAll()).toEqual({
  //       statusCode: HttpStatus.OK,
  //       message: 'All chats deleted successfully',
  //       data: null,
  //     });
  //     expect(mockChatService.removeAll).toHaveBeenCalled();
  //   });

  //   it('should throw a not found exception when there are no chats to delete', async () => {
  //     mockChatService.removeAll.mockReturnValueOnce({ deletedCount: 0 });
  //     await expect(controller.removeAll()).rejects.toThrow(
  //       new NotFoundException('No chats found to delete'),
  //     );
  //   });
  // });
});
