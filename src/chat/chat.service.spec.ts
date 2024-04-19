import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getModelToken } from '@nestjs/mongoose';
import { Chat, ChatDocument, ChatType } from './schemas/chat.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto/update-chat.dto';
import { DeleteResult, ObjectId } from 'mongodb';

describe('ChatService', () => {
  let service: ChatService;
  let model: any; // Use 'any' to simplify type handling for mocks

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(Chat.name),
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

    service = module.get<ChatService>(ChatService);
    model = module.get(getModelToken(Chat.name));
  });

  describe('create', () => {
    it('should successfully create a chat', async () => {
      const createChatDto: any = { type: 'group', group: new ObjectId() };
      const expectedChat = { _id: new ObjectId(), ...createChatDto };

      model.create.mockResolvedValue(expectedChat);

      const result = await service.create(createChatDto);
      expect(result).toEqual(expectedChat);
      expect(model.create).toHaveBeenCalledWith(createChatDto);
    });

    it('should throw a BadRequestException if creation fails', async () => {
      model.create.mockResolvedValue(null);

      const dto: CreateChatDto = {
        type: ChatType.Direct,
        members: [new ObjectId(), new ObjectId()],
        messages: [new ObjectId(), new ObjectId()],
        group: new ObjectId().toString(),
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of chats', async () => {
      const expectedChats = [
        {
          _id: new ObjectId(),
          type: ChatType.Direct,
          members: [new ObjectId()],
        },
        { _id: new ObjectId(), type: ChatType.Group, group: new ObjectId() },
      ];
      model.find.mockReturnThis();
      model.exec.mockResolvedValue(expectedChats);

      const result = await service.findAll();
      expect(result).toEqual(expectedChats);
      expect(model.find).toHaveBeenCalled();
      expect(model.exec).toHaveBeenCalled();
    });

    it('should return an empty array when no chats are found', async () => {
      model.find.mockReturnThis();
      model.exec.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a chat if found', async () => {
      const chat = {
        _id: new ObjectId('66200cfbfebe313228efed6e'),
        type: ChatType.Direct,
        members: [new ObjectId()],
      };
      model.findById.mockReturnThis();
      model.exec.mockResolvedValue(chat);

      const result = await service.findOne(chat._id.toString());

      expect(result).toEqual(chat);
    });

    it('should return null if the chat is not found', async () => {
      model.findById.mockReturnThis();
      model.exec.mockResolvedValue(null);

      const result = await service.findOne('unknown-id');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a chat and return the updated chat', async () => {
      const updateChatDto: UpdateChatDto = {
        type: ChatType.Direct,
        group: new ObjectId().toString(),
      };
      const updatedChat = {
        _id: new ObjectId(),
        type: ChatType.Group,
        group: updateChatDto.group,
      };

      model.findByIdAndUpdate.mockReturnThis();
      model.exec.mockResolvedValue(updatedChat);

      const result = await service.update(
        updatedChat._id.toString(),
        updateChatDto,
      );
      expect(result).toEqual(updatedChat);
    });

    it('should return null if the chat to update is not found', async () => {
      model.findByIdAndUpdate.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));
      const result = await service.update(new ObjectId().toString(), {
        type: ChatType.Direct,
        members: [new ObjectId()],
      });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a chat and return a delete result', async () => {
      const deleteResult = { deletedCount: 1 };
      model.deleteOne.mockResolvedValue(deleteResult);

      const result = await service.remove(new ObjectId().toString());

      expect(result).toEqual(deleteResult);
    });

    it('should throw a NotFoundException if no chat is deleted', async () => {
      model.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.remove(new ObjectId().toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeAll', () => {
    it('should delete all chats and return a delete result', async () => {
      const deleteResult = { deletedCount: 5 };
      model.deleteMany.mockResolvedValue(deleteResult);

      const result = await service.removeAll();
      expect(result).toEqual(deleteResult);
    });

    // it('should return null if not chats are found to delete', async () => {
    //   model.deleteMany.mockImplementation(() => ({
    //     exec: jest.fn().mockResolvedValue(null),
    //   }));
    //   const result = await service.removeAll();
    //   expect(result).toBeNull();
    // });

    it('should handle the case where no chats are found to remove', async () => {
      const deleteResult = { deletedCount: 0 };
      model.deleteMany.mockResolvedValue(deleteResult);

      const result = await service.removeAll();
      expect(result).toEqual(deleteResult);
    });
  });
});
