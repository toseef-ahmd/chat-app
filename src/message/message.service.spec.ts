import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { getModelToken } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto/update-message.dto';
import { DeleteResult, ObjectId } from 'mongodb';

describe('MessageService', () => {
  let service: MessageService;
  let model: any; // Use 'any' to simplify type handling for mocks

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getModelToken(Message.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockReturnThis(),
            deleteOne: jest.fn().mockReturnThis(),
            deleteMany: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    model = module.get(getModelToken(Message.name));
  });

  describe('create', () => {
    it('should successfully create a message', async () => {
      const createMessageDto: any = { sender: 'User1', content: 'Hello World' };
      const expectedMessage = { _id: '1', ...createMessageDto };

      model.create.mockResolvedValue(expectedMessage);

      const result = await service.create(createMessageDto);
      expect(result).toEqual(expectedMessage);
      expect(model.create).toHaveBeenCalledWith(createMessageDto);
    });

    it('should throw a BadRequestException if creation fails', async () => {
      model.create.mockResolvedValue(null);

      const dto: CreateMessageDto = {
        sender: new ObjectId(),
        content: 'Hello World',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of messages', async () => {
      const expectedMessages = [
        { _id: '1', sender: 'User1', content: 'Hello World' },
        { _id: '2', sender: 'User2', content: 'Goodbye World' },
      ];
      model.find.mockReturnThis();
      model.exec.mockResolvedValue(expectedMessages);

      const result = await service.findAll();
      expect(result).toEqual(expectedMessages);
      expect(model.find).toHaveBeenCalled();
      expect(model.exec).toHaveBeenCalled();
    });

    it('should return an empty array when no messages are found', async () => {
      model.find.mockReturnThis();
      model.exec.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a message if found', async () => {
      const message = { _id: '1', sender: 'User1', content: 'Hello World' };
      model.findById.mockReturnThis();
      model.exec.mockResolvedValue(message);

      const result = await service.findOne('1');
      expect(result).toEqual(message);
    });

    it('should return null if the message is not found', async () => {
      model.findById.mockReturnThis();
      model.exec.mockResolvedValue(null);

      const result = await service.findOne('unknown-id');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a message and return the updated message', async () => {
      const updateMessageDto: UpdateMessageDto = { content: 'Updated Content' };
      const updatedMessage = {
        _id: '1',
        sender: 'User1',
        content: 'Updated Content',
      };

      model.findByIdAndUpdate.mockReturnThis();
      model.exec.mockResolvedValue(updatedMessage);

      const result = await service.update('1', updateMessageDto);
      expect(result).toEqual(updatedMessage);
    });

    it('should return null if the group to update is not found', async () => {
      model.findByIdAndUpdate.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));
      const result = await service.update('unknown-id', {
        content: 'Any Name',
      });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a message and return a delete result', async () => {
      const deleteResult = { deletedCount: 1 };
      model.deleteOne.mockResolvedValue(deleteResult);

      const result = await service.remove('1');
      expect(result).toEqual(deleteResult);
    });

    it('should throw a NotFoundException if no message is deleted', async () => {
      model.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.remove('unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeAll', () => {
    it('should delete all messages and return a delete result', async () => {
      const deleteResult = { deletedCount: 5 };
      model.deleteMany.mockResolvedValue(deleteResult);

      const result = await service.removeAll();
      expect(result).toEqual(deleteResult);
    });
  });
});
