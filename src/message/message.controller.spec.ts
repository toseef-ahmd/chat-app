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

  describe('findOne', () => {
    it('should fetch a single message by ID', async () => {
      const messageId = 'existing-id';
      const expectedData = {
        _id: messageId,
        sender: 'User1',
        content: 'Hello',
      };
      expect(await controller.findOne(messageId)).toEqual({
        statusCode: HttpStatus.FOUND,
        message: 'Message fetched successfully',
        data: expectedData,
        links: expect.anything(),
      });
      expect(mockMessageService.findOne).toHaveBeenCalledWith(messageId);
    });

    it('should throw a NotFoundException when message does not exist', async () => {
      const messageId = 'non-existing-id';
      await expect(controller.findOne(messageId)).rejects.toThrow(
        new NotFoundException(`Message with ID ${messageId} not found`),
      );
    });
  });

  describe('update', () => {
    it('should update a message', async () => {
      const messageId = 'unique-message-id';
      const dto = { content: 'Updated content' };
      expect(await controller.update(messageId, dto)).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Message updated successfully',
        data: { _id: messageId, ...dto },
        links: expect.anything(),
      });
      expect(mockMessageService.update).toHaveBeenCalledWith(messageId, dto);
    });

    it('should throw a NotFoundException when trying to update a non-existing message', async () => {
      const messageId = 'non-existing-id';
      await expect(controller.update(messageId, {})).rejects.toThrow(
        new NotFoundException(`Message with ID ${messageId} not found`),
      );
    });
  });

  describe('remove', () => {
    it('should delete a message and return success', async () => {
      const messageId = 'existing-id';
      expect(await controller.remove(messageId)).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Message deleted successfully',
        data: null,
        links: expect.anything(),
      });
      expect(mockMessageService.remove).toHaveBeenCalledWith(messageId);
    });

    it('should throw a NotFoundException when trying to delete a non-existing message', async () => {
      const messageId = 'invalid-id';
      await expect(controller.remove(messageId)).rejects.toThrow(
        new NotFoundException(`Message with ID ${messageId} not found`),
      );
    });
  });
});
