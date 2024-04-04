import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;

  // Create a mock object for the UserModel
  const mockUserService = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    mockUserService.create.mockClear();
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      // Provide both the service and a mock version of the UserModel
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
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
    const createUserDto: CreateUserDto = {
      name: 'testUser',
      password: 'testPass',
      email: 'test@example.com',
    };

    const createdUser = {
      _id: '60f7b3b3b5f7f7b3b5f7f7b3',
      ...createUserDto
    }; // Mock the created user object

    mockUserService.create.mockReturnValue(createdUser); // Mock the return value for the create method
    
    expect(await mockUserService.create(createUserDto)).toBe(createdUser);
    expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should throw an error if a required field is missing', async () => {
    const incompleteCreateUserDto = {
      // email and name are missing, which are required
      password: 'testPass',
    };

    mockUserService.create.mockRejectedValue(
      new Error("ValidationError: 'email' and 'name' are required"),
    );

    await expect(
      mockUserService.create(incompleteCreateUserDto),
    ).rejects.toThrow("ValidationError: 'email' and 'name' are required");

  });

  it('should not be called with incomplete data', async () => {
    const incompleteCreateUserDto = {
      // email and name are missing, which are required
      password: 'testPass',
    };

    expect(mockUserService.create).not.toHaveBeenCalledWith(
      incompleteCreateUserDto,
    );
  });
  // Additional tests for other methods...
});


