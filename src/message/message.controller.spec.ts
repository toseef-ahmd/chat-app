import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto/create-message.dto';
import { ObjectId } from 'mongodb';

describe('MessageController Functions Tests', () => {
  let controller: MessageController;

  const mockMessageService = {
    create: jest.fn((dto) => ({
      _id: 'unique-message-id',
      ...dto,
    })),
    findAll: jest.fn(() => [
      { _id: 'unique-message-id1', sender: 'User1', content: 'Hello' },
      { _id: 'unique-message-id2', sender: 'User2', content: 'Hi there' },
    ]),
    findOne: jest.fn((id) => {
      if (id === 'existing-id') {
        return { _id: id, sender: 'User1', content: 'Hello' };
      } else {
        throw new NotFoundException(`Message with ID ${id} not found`);
      }
    }),
    update: jest.fn((id, dto) => {
      if (id === 'unique-message-id') {
        return { _id: id, ...dto };
      } else {
        throw new NotFoundException(`Message with ID ${id} not found`);
      }
    }),
    remove: jest.fn((id) => {
      if (id === 'existing-id') {
        return { deletedCount: 1 };
      } else {
        throw new NotFoundException(`Message with ID ${id} not found`);
      }
    }),
    removeAll: jest.fn(() => ({
      deletedCount: 2,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [MessageService],
    })
      .overrideProvider(MessageService)
      .useValue(mockMessageService)
      .compile();

    controller = module.get<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Message - Create', () => {
    it('should create a new message', async () => {
      const dto: CreateMessageDto = {
        sender: new ObjectId(),
        content: 'Hello World',
      };
      expect(await controller.create(dto)).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Message created successfully',
        data: { _id: expect.any(String), ...dto },
      });
      expect(mockMessageService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('Message - FindAll', () => {
    it('should fetch all messages', async () => {
      expect(await controller.findAll()).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Messages fetched successfully',
        data: [
          { _id: 'unique-message-id1', sender: 'User1', content: 'Hello' },
          { _id: 'unique-message-id2', sender: 'User2', content: 'Hi there' },
        ],
      });
      expect(mockMessageService.findAll).toHaveBeenCalled();
    });
  });

  describe('Message - FindOne', () => {
    it('should fetch a single message by ID', async () => {
      const messageId = 'existing-id';
      expect(await controller.findOne(messageId)).toEqual({
        statusCode: HttpStatus.FOUND,
        message: 'Message fetched successfully',
        data: { _id: messageId, sender: 'User1', content: 'Hello' },
      });
      expect(mockMessageService.findOne).toHaveBeenCalledWith(messageId);
    });

    it('should throw a not found exception when message does not exist', async () => {
      const messageId = 'non-existing-id';
      await expect(controller.findOne(messageId)).rejects.toThrow(
        new NotFoundException(`Message with ID ${messageId} not found`),
      );
    });
  });

  describe('Message - Update', () => {
    it('should update a message', async () => {
      const dto = { content: 'Updated Message' };
      const messageId = 'unique-message-id';
      expect(await controller.update(messageId, dto)).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Message updated successfully',
        data: { _id: messageId, ...dto },
      });
      expect(mockMessageService.update).toHaveBeenCalledWith(messageId, dto);
    });

    it('should throw a not found exception when trying to update a non-existing message', async () => {
      const messageId = 'non-existing-id';
      await expect(controller.update(messageId, {})).rejects.toThrow(
        new NotFoundException(`Message with ID ${messageId} not found`),
      );
    });
  });

  describe('Message - Remove', () => {
    it('should delete a message and return success', async () => {
      const messageId = 'existing-id';

      const result = await controller.remove(messageId);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Message deleted successfully',
        data: null,
      });
      expect(mockMessageService.remove).toHaveBeenCalledWith(messageId);
    });

    it('should throw a not found exception when trying to delete a non-existing message', async () => {
      const messageId = 'invalid-id';
      await expect(controller.remove(messageId)).rejects.toThrow(
        new NotFoundException(`Message with ID ${messageId} not found`),
      );
    });
  });

  describe('Message - RemoveAll', () => {
    it('should delete all messages and return success', async () => {
      expect(await controller.removeAll()).toEqual({
        statusCode: HttpStatus.OK,
        message: 'All messages deleted successfully',
        data: null,
      });
      expect(mockMessageService.removeAll).toHaveBeenCalled();
    });

    it('should throw a not found exception when there are no messages to delete', async () => {
      mockMessageService.removeAll.mockReturnValueOnce({ deletedCount: 0 });
      await expect(controller.removeAll()).rejects.toThrow(
        new NotFoundException('No messages found to delete'),
      );
    });
  });
});
