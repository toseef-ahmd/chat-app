import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ChatController } from '../src/chat/chat.controller';
import { ChatService } from '../src/chat/chat.service';
import { CreateChatDto } from '../src/chat/dto/create-chat.dto/create-chat.dto';
import { AllExceptionsFilter } from '../src/filters/exceptions.filter';
import { ObjectId } from 'mongodb';
import { ChatType } from '../src/chat/schemas/chat.schema';

describe('ChatController (e2e)', () => {
  let app: INestApplication;
  const chatService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [{ provide: ChatService, useValue: chatService }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (validationErrors = []) =>
          new BadRequestException({
            statusCode: 400,
            error: 'Bad Request',
            message: validationErrors.flatMap((err) =>
              Object.values(err.constraints).map((message) => message),
            ),
          }),
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/POST chats', () => {
    it('should create a chat successfully', async () => {
      const createChatDto: CreateChatDto = {
        type: ChatType.Group, // assuming 'group' is a valid ChatType
        members: [new ObjectId(), new ObjectId()],
        messages: [new ObjectId()],
        group: new ObjectId().toString(),
      };
      const expectedChat = {
        _id: new ObjectId().toString(),
        ...createChatDto,
      };

      chatService.create.mockResolvedValue(expectedChat);

      await request(app.getHttpServer())
        .post('/chats')
        .send(createChatDto)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.data._id).toEqual(expectedChat._id);
          expect(body.data.type).toEqual(ChatType.Group);
        });
    });
  });

  describe('/GET chats', () => {
    it('should retrieve all chats successfully', async () => {
      const chats = [
        {
          _id: new ObjectId().toString(),
          type: 'group',
          members: [new ObjectId()],
        },
        {
          _id: new ObjectId().toString(),
          type: 'direct',
          members: [new ObjectId(), new ObjectId()],
        },
      ];
      chatService.findAll.mockResolvedValue(chats);

      await request(app.getHttpServer())
        .get('/chats')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data.length).toBe(2);
          expect(body.data[0].type).toEqual('group');
        });
    });
  });

  describe('/GET chats/:id', () => {
    it('should retrieve a single chat by ID', async () => {
      const chat = {
        _id: new ObjectId().toString(),
        type: 'group',
        members: [new ObjectId()],
      };
      chatService.findOne.mockResolvedValue(chat);

      await request(app.getHttpServer())
        .get(`/chats/${chat._id}`)
        .expect(HttpStatus.FOUND)
        .expect(({ body }) => {
          expect(body.data._id).toEqual(chat._id);
          expect(body.data.type).toEqual('group');
        });
    });
  });

  describe('/PUT chats/:id', () => {
    it('should update a chat successfully', async () => {
      const updateData = {
        // type: new ObjectId().toString(),
        members: [new ObjectId().toString()],
        messages: [new ObjectId().toString()],
      };
      const updatedChat = {
        _id: new ObjectId().toString(),
        ...updateData,
      };
      chatService.update.mockResolvedValueOnce(updatedChat);
      await request(app.getHttpServer())
        .put(`/chats/${updatedChat._id}`)
        .send(updateData)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data._id).toEqual(updatedChat._id);
          expect(body.data.members).toEqual(updatedChat.members);
          expect(body.data.messages).toEqual(updatedChat.messages);
        })
        .catch((err) => console.error('Error during test:', err));
    });
  });

  describe('/DELETE chats/:id', () => {
    it('should delete a chat successfully', async () => {
      const deleteResult = { deletedCount: 1 };

      chatService.remove.mockResolvedValue(deleteResult);

      await request(app.getHttpServer())
        .delete(`/chats/${new ObjectId().toString()}`)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeNull();
          expect(body.message).toEqual('Chat deleted successfully');
        });
    });
  });
});
