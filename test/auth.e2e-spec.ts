import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; // Ensure this path matches your structure
import { AuthService } from '../src/auth/auth.service'; // Adjust this path as necessary
import { AllExceptionsFilter } from '../src/filters/exceptions.filter';
import { AuthController } from '../src/auth/auth.controller';
import e from 'express';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const mockAuthService = {
    login: jest.fn(),
    signup: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [], // Replace with actual UserModule import
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new AllExceptionsFilter());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (validationErrors = []) => {
          const simplifiedMessages = validationErrors.flatMap((err) => {
            // Concatenate the property name with each constraint description
            return Object.values(err.constraints).map((message) => {
              return message;
            });
          });
          return new BadRequestException({
            statusCode: 400,
            error: 'Bad Request',
            message: simplifiedMessages,
          });
        },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    // await app.close();
  });

  describe('login', () => {
    it('/auth/login (POST)', async () => {
      mockAuthService.login.mockResolvedValueOnce('mock-access-token');

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user@example.com', password: 'password123' })
        .expect(HttpStatus.OK) // using HttpStatus directly is also fine
        .expect(({ body }) => {
          expect(body.statusCode).toEqual(HttpStatus.OK);
          expect(body.message).toEqual('User logged in successfully');
          expect(body.data).toEqual('mock-access-token');
        });
    });

    it('should return a 400 error on wrong password', async () => {
      mockAuthService.login.mockRejectedValueOnce(
        new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: ['Invalid password'],
        }),
      );

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'abc@gmail.com', password: '1ww' })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(body.error).toEqual('Unauthorized');
          expect(body.message).toEqual(['Invalid password']);
        });
    });

    it('should return a 400 error on wrong email', async () => {
      mockAuthService.login.mockRejectedValueOnce(
        new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
          message: ['Invalid Email'],
        }),
      );

      return await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'ac@zb.com', password: '1234' })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(body.error).toEqual('Unauthorized');
          expect(body.message).toEqual(['Invalid Email']);
        });
    });

    it('should return a 400 error on invalid email', async () => {
      // mockAuthService.signup.mockRejectedValueOnce(new Error('Invalid email'));

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'abc123', username: 'avb', password: '1234' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.message).toEqual(['email must be an email']);
        });
    });
  });

  describe('signup', () => {
    it('/auth/signup (POST)', async () => {
      mockAuthService.signup.mockResolvedValueOnce('mock-signup-token');

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'newuser@example.com',
          password: 'newpass123',
          username: 'newuser',
        })
        .expect(201)
        .expect(({ body }) => {
          expect(body.statusCode).toEqual(HttpStatus.CREATED);
          expect(body.message).toEqual('User created successfully');
          expect(body.data).toEqual('mock-signup-token');
        });
    });

    it('should return a 400 error on missing email', async () => {
      // mockAuthService.signup.mockRejectedValueOnce(new Error('Invalid email'));

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ username: 'avb', password: '1234' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.message).toEqual([
            'email should not be empty',
            'email must be an email',
          ]);
        });
    });

    it('should return a 400 error on invalid email', async () => {
      // mockAuthService.signup.mockRejectedValueOnce(new Error('Invalid email'));

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'abc123', username: 'avb', password: '1234' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.message).toEqual(['email must be an email']);
        });
    });

    it('should return a 400 error on missing password', async () => {
      // mockAuthService.signup.mockRejectedValueOnce(
      //   new Error('Invalid password'),
      // );

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'abc@gmail.com', username: 'avb' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.message).toEqual([
            'password should not be empty',
            'password must be a string',
          ]);
        });
    }); // Add this block to your test file

    afterEach(async () => {
      await app.close();
    });
  });
});
