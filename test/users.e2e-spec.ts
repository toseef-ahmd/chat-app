import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { UserController } from '../src/user/user.controller';
import { UserService } from '../src/user/user.service';
import { BadRequestException, INestApplication } from '@nestjs/common';
import { CreateUserDto } from '../src/user/dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto/update-user.dto';
import { error, time } from 'console';

describe('UserController', () => {
  let app: INestApplication;
  const userService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Replace with actual UserModule import
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  //  ** Create User Tests **

  it('/POST users (Create User)', () => {
    const newUserData: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
    };
    userService.create.mockReturnValue(
      Promise.resolve({ ...newUserData, _id: 1 }),
    );

    return request(app.getHttpServer())
      .post('/users')
      .send(newUserData)
      .expect({
        status: 201,
        message: 'User created successfully',
        data: { _id: 1, ...newUserData },
      });
  });

  it('/POST users - Validation Error', async () => {
    const invalidUserData = { username: 'test' }; // Missing required fields like email

    const err = new BadRequestException({
      statusCode: 400,
      message: [
        'email should not be empty',
        'email must be an email',
        'password should not be empty',
        'password must be a string',
      ],
    });
    userService.create.mockRejectedValue(err);

    await request(app.getHttpServer())
      .post('/users')
      .send(invalidUserData)
      .expect(400)
      .expect({
        statusCode: 400,
        message: [
          'email should not be empty',
          'email must be an email',
          'password should not be empty',
          'password must be a string',
        ],
      });
  });

  it('/POST users - Validation Error - No Username', async () => {
    const invalidUserData = { username: 'test' }; // Missing required fields like email

    const err = new BadRequestException({
      statusCode: 400,
      error: 'Bad Request',
      message: ['username should not be empty', 'username must be a string'],
    });
    userService.create.mockRejectedValue(err);

    await request(app.getHttpServer())
      .post('/users')
      .send(invalidUserData)
      .expect({
        statusCode: 400,
        error: 'Bad Request',
        message: ['username should not be empty', 'username must be a string'],
      });
  });

  it('/POST users - Validation Error - No Email', async () => {
    const invalidUserData = { username: 'test' }; // Missing required fields like email

    const err = new BadRequestException({
      statusCode: 400,
      error: 'Bad Request',
      message: ['email should not be empty', 'email must be an email'],
    });
    userService.create.mockRejectedValue(err);

    await request(app.getHttpServer())
      .post('/users')
      .send(invalidUserData)
      .expect({
        statusCode: 400,
        error: 'Bad Request',
        message: ['email should not be empty', 'email must be an email'],
      });
  });

  it('/POST users - Validation Error - No Password', async () => {
    const invalidUserData = { username: 'test' }; // Missing required fields like email

    userService.create.mockRejectedValue(
      new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: ['password should not be empty', 'password must be a string'],
      }),
    );

    await request(app.getHttpServer())
      .post('/users')
      .send(invalidUserData)
      .expect({
        statusCode: 400,
        error: 'Bad Request',
        message: ['password should not be empty', 'password must be a string'],
      });
  });

  //  ** Read User Tests **

  it('/GET users (Find All Users)', () => {
    const users = [{ id: 1, username: 'user1', email: 'user1@example.com' }];
    userService.findAll.mockReturnValue(Promise.resolve(users));

    return request(app.getHttpServer())
      .get('/users')
      .expect({
        status: 200,
        message: 'Users fetched successfully',
        data: [{ id: 1, username: 'user1', email: 'user1@example.com' }],
      });
  });

  it('/GET users/:id (Find One User)', () => {
    const userId = 1;
    const user = { id: userId, username: 'user1', email: 'user1@example.com' };
    userService.findOne.mockReturnValue(Promise.resolve(user));

    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200)
      .expect({
        status: 200,
        message: 'User fetched successfully',
        data: { id: 1, username: 'user1', email: 'user1@example.com' },
      });
  });

  it('/GET users/:id (Find One User) - Not Found', async () => {
    const userId = 10; // Non-existent ID
    userService.findOne.mockReturnValue(Promise.resolve(null));

    await request(app.getHttpServer()).get(`/users/${userId}`).expect({
      message: 'User does not exist',
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it('/PUT users/:id (Update User)', () => {
    const userId = 1;
    const updateData = { email: 'updated@example.com' };
    const updatedUser = { ...updateData, id: userId, username: 'user1' }; // Existing username
    userService.update.mockReturnValue(Promise.resolve(updatedUser));

    return request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updateData)
      .expect({
        status: 200,
        message: 'User updated successfully',
        data: { email: 'updated@example.com', id: 1, username: 'user1' },
      });
  });

  it('/PUT users/:id (Update User) - Not Found', () => {
    const userId = 10; // Non-existent ID
    const updateData = { email: 'updated@example.com' };
    userService.update.mockReturnValue(Promise.resolve(null));

    return request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updateData)
      .expect(404); // Replace with appropriate error status code for not found
  });
});
