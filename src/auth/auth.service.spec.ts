import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserRoles, UserStatus } from '../user/schemas/user.schema';
import mongoose from 'mongoose';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findUserByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
  });

  describe('Signup', () => {
    it('should return a valid JWT token for successful user creation', async () => {
      const createUserDto = {
        username: 'validuser',
        email: 'valid@example.com',
        password: 'securePassword123',
      };

      const expectedUser = {
        _id: '1',
        ...createUserDto,
        password: 'hashedPassword', // Simulated hashed password
        firstName: 'Valid',
        lastName: 'User',
        avatar: 'defaultAvatar.png',
        status: UserStatus.Online,
        role: UserRoles.User,
        friends: new mongoose.Types.Array<mongoose.Types.ObjectId>(), // Simulate an empty array of friends
      };

      userService.create.mockResolvedValue(expectedUser);
      jwtService.signAsync.mockResolvedValue('jwtToken');

      await authService.signup(createUserDto);

      // Since the password is hashed dynamically, we check for any string
      expect(userService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: expect.any(String),
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        username: 'validuser',
        sub: '1',
      });

      const result = await authService.signup(createUserDto);
      expect(result).toBe('jwtToken');
    });

    it('should throw NotFoundException if user creation fails', async () => {
      const createUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testPass123',
      };

      userService.create.mockResolvedValue(null); // Simulate failure to create user

      await expect(authService.signup(createUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(userService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: expect.any(String),
      });
      expect(jwtService.signAsync).not.toHaveBeenCalled(); // Ensure JWT is not signed since user creation failed
    });
  });

  describe('Login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'validPassword',
    };

    it('should throw UnauthorizedException if no user is found', async () => {
      userService.findUserByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.findUserByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if the password does not match', async () => {
      const user = {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'plainPassword',
        firstName: 'Valid',
        lastName: 'User',
        avatar: 'defaultAvatar.png',
        status: UserStatus.Online,
        role: UserRoles.User,
        friends: new mongoose.Types.Array<mongoose.Types.ObjectId>(),
      };
      userService.findUserByEmail.mockResolvedValue(user);

      // Simulate password mismatch
      jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(Promise.resolve(false) as Promise<boolean> as never);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(userService.findUserByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should call the bcrypt compare method when logging in', async () => {
      // Prepare a fake user object with the hashed password
      const user = {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'plainPassword',
        firstName: 'Valid',
        lastName: 'User',
        avatar: 'defaultAvatar.png',
        status: UserStatus.Online,
        role: UserRoles.User,
        friends: new mongoose.Types.Array<mongoose.Types.ObjectId>(),
      };
      userService.findUserByEmail.mockResolvedValue(user);
      jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(Promise.resolve(true) as Promise<boolean> as never);

      // Call the login function with the user's credentials
      await authService.login({
        email: 'user@example.com',
        password: 'plainPassword',
      });

      // Check if bcrypt.compare was called - which would mean the password was verified
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'plainPassword',
        user.password,
      );
    });

    it('should return a valid JWT token when credentials are correct', async () => {
      const user = {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'plainPassword',
        firstName: 'Valid',
        lastName: 'User',
        avatar: 'defaultAvatar.png',
        status: UserStatus.Online,
        role: UserRoles.User,
        friends: new mongoose.Types.Array<mongoose.Types.ObjectId>(),
      };

      userService.findUserByEmail.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(Promise.resolve(true));

      const payload = {
        username: user.username,
        sub: user._id,
      };
      jwtService.signAsync.mockResolvedValueOnce('jwtToken');

      const result = await authService.login(loginDto);
      expect(result).toEqual('jwtToken');
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
    });
  });
  // Other tests for login and additional functionalities...
});
