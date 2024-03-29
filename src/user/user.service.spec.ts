import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

describe('UserService', () => {
  let service: UserService;

  // Create a mock object for the UserModel
  const mockUserModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // Provide both the service and a mock version of the UserModel
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add tests for your service methods, making use of the mock UserModel
  // For example:
  it('should create a user', async () => {
    const createUserDto = {
      username: 'testUser',
      password: 'testPass',
      email: 'test@example.com',
    };
    mockUserModel.create.mockReturnValue(createUserDto); // Mock the return value for the create method
    expect(await service.create(createUserDto)).toBe(createUserDto);
    expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto);
  });

  // Additional tests for other methods...
});
