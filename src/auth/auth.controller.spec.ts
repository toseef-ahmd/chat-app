import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { LoginDto } from './dto/auth-login.dto/auth-login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn((dto) => Promise.resolve('mocked-token')),
      signup: jest.fn((dto) => Promise.resolve('mocked-signup-token')),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a valid token and success message on login', async () => {
      const dto: LoginDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      const result = await controller.login(dto);
      expect(result.links).toBeDefined();
      expect(result.data).toEqual('mocked-token');
      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('User logged in successfully');
    });

    it('should return a 401 error on invalid login', async () => {
      mockAuthService.login.mockRejectedValueOnce(
        new Error('Invalid credentials'),
      );

      const dto = {
        email: 'abc@gmail.com',
        password: 'password',
      };

      await expect(controller.login(dto)).rejects.toThrow(
        new UnauthorizedException(`Invalid credentials`),
      );
    });

    it('should return a 400 error on invalid email', async () => {
      mockAuthService.login.mockRejectedValueOnce(new Error('Invalid Email'));

      const dto = {
        email: 'ac',
        password: 'password',
      };

      await expect(controller.login(dto)).rejects.toThrow(
        new UnauthorizedException(`Invalid Email`),
      );
    });
  });
  describe('signup', () => {
    it('should return a token and success message on signup', async () => {
      const dto: CreateUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'newpass123',
      };

      const result = await controller.signup(dto);
      expect(mockAuthService.signup).toHaveBeenCalledWith(dto);

      expect(result.statusCode).toEqual(HttpStatus.CREATED);
      expect(result.data).toEqual('mocked-signup-token');
      expect(result.message).toEqual('User created successfully');
      expect(result.links).toBeDefined();
    });

    it('should return a 400 error on invalid email', async () => {
      mockAuthService.login.mockRejectedValueOnce(new Error('Invalid Email'));

      const dto = {
        email: 'ac',
        username: 'username',
        password: 'password',
      };

      await expect(controller.login(dto)).rejects.toThrow(
        new UnauthorizedException(`Invalid Email`),
      );
    });

    it('should return a 400 error on missing password', async () => {
      mockAuthService.login.mockRejectedValueOnce(
        new Error('Password Required'),
      );

      const dto = {
        email: 'ac@gmail.com',
        username: 'username',
        password: '',
      };

      await expect(controller.login(dto)).rejects.toThrow(
        new UnauthorizedException(`Password Required`),
      );
    });
  });
});
