import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './auth.middleware';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth/auth.service'; // Update the import path according to your project structure
import { UnauthorizedException } from '@nestjs/common';

// Mock implementations for services
const mockConfigService = {
  get: jest.fn().mockImplementation((key: string) => {
    switch (key) {
      case 'JWT_SECRET':
        return 'secret_key';
      default:
        return null;
    }
  }),
};

const mockAuthService = {
  validateUser: jest.fn().mockImplementation(async (payload) => {
    if (payload.username === 'validUser') {
      return { userId: 1, username: 'validUser' };
    }
    return null;
  }),
};

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // Register necessary providers
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  // it('should return a user object when validation is successful', async () => {
  //   const payload = { userId: 1, username: 'validUser' };
  //   const result = await jwtStrategy.validate(payload);


  //   expect(result).toEqual({ userId: 1, username: 'validUser' });
  //   expect(mockAuthService.validateUser).toHaveBeenCalledWith(payload);
  // });

  // it('should throw UnauthorizedException when user cannot be validated', async () => {
  //   const payload = { username: 'invalidUser' };
  //   await expect(jwtStrategy.validate(payload)).rejects.toThrow(
  //     UnauthorizedException,
  //   );
  // });
});
