import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { UserController } from '../src/user/user.controller';
import { UserService } from '../src/user/user.service';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../src/user/dto/create-user.dto/create-user.dto';
import { AllExceptionsFilter } from '../src/filters/exceptions.filter';

describe('UserController', () => {
  let app: INestApplication;
  const userService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
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
    jest.clearAllMocks();
  });

  describe('/POST users', () => {
    it('should create a user successfully', async () => {
      const newUserData: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };
      userService.create.mockResolvedValue({ ...newUserData, _id: 1 });

      await request(app.getHttpServer())
        .post('/user')
        .send(newUserData)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.data.username).toBe('testuser');
          expect(body.data.email).toBe('test@example.com');
          expect(body.data._id).toBe(1);
        });
    });

    it('should return a validation error if data is incomplete', async () => {
      const incompleteData = { username: 'test' }; // Missing required fields like email and password

      await request(app.getHttpServer())
        .post('/user')
        .send(incompleteData)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.error).toBe('Bad Request');
          expect(body.message).toContain('email must be an email');
          expect(body.message).toContain('password should not be empty');
        });
    });
  });

  describe('/GET users', () => {
    it('should retrieve all users successfully', async () => {
      const users = [{ id: 1, username: 'user1', email: 'user1@example.com' }];
      userService.findAll.mockResolvedValueOnce(users);

      await request(app.getHttpServer())
        .get('/user')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data.length).toBe(1);
          expect(body.message).toEqual('Users fetched successfully');
          expect(body.data[0].username).toBe('user1');
        });
    });

    it('should retrieve a single user by ID', async () => {
      const user = { id: 1, username: 'user1', email: 'user1@example.com' };
      userService.findOne.mockResolvedValue(user);

      await request(app.getHttpServer())
        .get('/user/1')
        .expect(HttpStatus.FOUND)
        .expect(({ body }) => {
          expect(body.data.id).toBe(1);
          expect(body.data.email).toBe('user1@example.com');
          expect(body.data.username).toBe('user1');
        });
    });

    it('should return not found if the user does not exist', async () => {
      userService.findOne.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/user/999')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/PUT users/:id', () => {
    it('should update a user successfully', async () => {
      const updateData = { email: 'updated@example.com' };
      const updatedUser = {
        id: 1,
        username: 'user1',
        email: 'updated@example.com',
      };
      userService.update.mockResolvedValue(updatedUser);

      await request(app.getHttpServer())
        .put('/user/1')
        .send(updateData)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data.email).toBe('updated@example.com');
        });
    });

    it('should return not found when updating a non-existing user', async () => {
      userService.update.mockResolvedValue(null);

      await request(app.getHttpServer())
        .put('/user/999')
        .send({ email: 'doesnotmatter@example.com' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/DELETE users/:id', () => {
    it('should delete a user successfully', async () => {
      userService.remove.mockResolvedValue({ deletedCount: 1 });

      await request(app.getHttpServer())
        .delete('/user/1')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data).toBe(null);
        });
    });

    it('should return not found when trying to delete a non-existing user', async () => {
      userService.remove.mockResolvedValue({ deletedCount: 0 });

      await request(app.getHttpServer())
        .delete('/user/999')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
