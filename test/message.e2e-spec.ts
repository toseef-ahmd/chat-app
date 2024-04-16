import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { MessageController } from '../src/message/message.controller';
import { MessageService } from '../src/message/message.service';
import { CreateMessageDto } from '../src/message/dto/create-message.dto/create-message.dto';
import { AllExceptionsFilter } from '../src/filters/exceptions.filter';
import { ObjectId } from 'mongodb';

describe('MessageController (e2e)', () => {
  let app: INestApplication;
  const messageService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [{ provide: MessageService, useValue: messageService }],
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

  describe('/POST messages', () => {
    it('should create a message successfully', async () => {
      const createMessageDto: CreateMessageDto = {
        sender: new ObjectId('607f1f77bcf86cd799439011'),
        content: 'Hello World',
      };
      const expectedMessage = {
        _id: '607f1f77bcf86cd799439011',
        ...createMessageDto,
      };

      messageService.create.mockResolvedValue(expectedMessage);

      await request(app.getHttpServer())
        .post('/messages')
        .send(createMessageDto)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.data._id).toEqual('607f1f77bcf86cd799439011');
          expect(body.data.content).toEqual('Hello World');
        });
    });
  });

  describe('/GET messages', () => {
    it('should retrieve all messages successfully', async () => {
      const messages = [
        { _id: '607f1f77bcf86cd799439011', sender: 'User1', content: 'Hello' },
        {
          _id: '607f1f77bcf86cd799439012',
          sender: 'User2',
          content: 'Hi there',
        },
      ];
      messageService.findAll.mockResolvedValue(messages);

      await request(app.getHttpServer())
        .get('/messages')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data.length).toBe(2);
          expect(body.data[0].content).toEqual('Hello');
        });
    });
  });

  describe('/GET messages/:id', () => {
    it('should retrieve a single message by ID', async () => {
      const message = {
        _id: '607f1f77bcf86cd799439011',
        sender: 'User1',
        content: 'Hello',
      };
      messageService.findOne.mockResolvedValue(message);

      await request(app.getHttpServer())
        .get('/messages/607f1f77bcf86cd799439011')
        .expect(HttpStatus.FOUND)
        .expect(({ body }) => {
          expect(body.data._id).toEqual('607f1f77bcf86cd799439011');
          expect(body.data.content).toEqual('Hello');
        });
    });
  });

  describe('/PUT messages/:id', () => {
    it('should update a message successfully', async () => {
      const updateData = { content: 'Updated Hello' };
      const updatedMessage = {
        _id: '607f1f77bcf86cd799439011',
        sender: 'User1',
        content: 'Updated Hello',
      };

      messageService.update.mockResolvedValue(updatedMessage);

      await request(app.getHttpServer())
        .put('/messages/607f1f77bcf86cd799439011')
        .send(updateData)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data.content).toEqual('Updated Hello');
        });
    });
  });

  describe('/DELETE messages/:id', () => {
    it('should delete a message successfully', async () => {
      const deleteResult = { deletedCount: 1 };

      messageService.remove.mockResolvedValue(deleteResult);

      await request(app.getHttpServer())
        .delete('/messages/607f1f77bcf86cd799439011')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBeNull();
          expect(body.message).toEqual('Message deleted successfully');
        });
    });
  });
});
