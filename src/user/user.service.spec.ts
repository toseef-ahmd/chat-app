import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

describe('UserService', () => {
  // Function to validate DTOs
  async function validateDto<T extends object>(
    dto: unknown,
    dtoType: new () => T,
  ): Promise<T> {
    const dtoInstance = plainToInstance(dtoType, dto);
    const errors = await validate(dtoInstance as object); // Cast dtoInstance to object if necessary
    if (errors.length > 0) {
      throw new Error(
        `Validation failed: ${errors.map((e) => (e.constraints ? Object.values(e.constraints).join(', ') : '')).join(', ')}`,
      );
    }
    return dtoInstance;
  }

  let service: UserService;
  let mockUserModel;

  beforeEach(async () => {
    mockUserModel = {
      create: jest
        .fn()
        .mockImplementation((dto) =>
          Promise.resolve({ _id: 'unique-id', ...dto }),
        ),

      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),

      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockImplementation((id) =>
          id === 'existing-id'
            ? Promise.resolve({
                _id: 'existing-id',
                email: 'user@example.com',
              })
            : Promise.resolve(null),
        ),
      }),

      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest
          .fn()
          .mockImplementation((id, dto) =>
            id === 'existing-id'
              ? Promise.resolve({ _id: 'existing-id', ...dto })
              : Promise.resolve(null),
          ),
      }),

      deleteOne: jest
        .fn()
        .mockImplementation(({ _id }) =>
          _id === 'existing-id'
            ? Promise.resolve({ deletedCount: 1 })
            : Promise.resolve({ deletedCount: 0 }),
        ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Ensure clean state between tests
  });

  it('should not create a user with invalid email format', async () => {
    const invalidUserDto = {
      email: 'bad-email-format',
      password: 'securePass123',
      username: 'johnDoe',
    };
    await expect(validateDto(invalidUserDto, CreateUserDto)).rejects.toThrow(
      /Validation failed/,
    );
  });

  it('should create a user successfully if valid data is provided', async () => {
    const validUserDto = {
      email: 'test@example.com',
      password: 'secure123',
      username: 'testuser',
    };
    mockUserModel.create.mockResolvedValue({
      _id: 'unique-id',
      ...validUserDto,
    });

    const validatedDto = await validateDto(validUserDto, CreateUserDto);
    const result = await service.create(validatedDto as CreateUserDto);
    expect(result).toEqual({ _id: 'unique-id', ...validatedDto });
    expect(mockUserModel.create).toHaveBeenCalledWith(validatedDto);
  });

  it('should return all users, even if the array is empty', async () => {
    mockUserModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue([]),
    }); // Ensuring empty array response
    const result = await service.findAll();
    expect(result).toEqual([]);
    expect(mockUserModel.find).toHaveBeenCalled();
  });

  it('should retrieve a single user by ID or return null', async () => {
    // Ensure the mock is correctly set up right before the test
    mockUserModel.findById.mockReturnValue({
      exec: jest
        .fn()
        .mockResolvedValue({ _id: 'existing-id', email: 'user@example.com' }),
    });
    const result = await service.findOne('existing-id');
    expect(result).toEqual({ _id: 'existing-id', email: 'user@example.com' });

    // Ensure correct response for non-existing IDs
    mockUserModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    expect(await service.findOne('non-existing-id')).toBeNull();
  });

  it('should return null when findById is called with an invalid ID', async () => {
    const invalidId = 'nonexistent-id';
    mockUserModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null), // No user found
    });
    const result = await service.findOne(invalidId);
    expect(result).toBeNull();
    expect(mockUserModel.findById).toHaveBeenCalledWith(invalidId);
  });

  it('should update user email and username successfully', async () => {
    const updateData = {
      email: 'newemail@example.com',
      username: 'newUsername',
    };
    mockUserModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ _id: 'existing-id', ...updateData }),
    });

    // Correctly type the validation output
    const validatedUpdateData = await validateDto<UpdateUserDto>(
      updateData,
      UpdateUserDto,
    );
    const result = await service.update('existing-id', validatedUpdateData);
    expect(result).toEqual({ _id: 'existing-id', ...validatedUpdateData });
    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'existing-id',
      validatedUpdateData,
      { new: true },
    );
  });

  it('should return null when updating a user with an invalid ID', async () => {
    const invalidId = 'invalid-id';
    const updateData = { email: 'newemail@example.com' };
    mockUserModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null), // No user updated
    });
    const result = await service.update(invalidId, updateData);
    expect(result).toBeNull();
    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      invalidId,
      updateData,
      { new: true },
    );
  });

  it('should throw a NotFoundException when trying to delete a user with an invalid ID', async () => {
    const invalidId = 'invalid-id';
    mockUserModel.deleteOne.mockResolvedValue({ deletedCount: 0 }); // No user deleted
    await expect(service.remove(invalidId)).rejects.toThrow(NotFoundException);
    expect(mockUserModel.deleteOne).toHaveBeenCalledWith({ _id: invalidId });
  });

  it('should confirm deletion or throw if user does not exist', async () => {
    expect(await service.remove('existing-id')).toEqual({ deletedCount: 1 });
    await expect(service.remove('non-existing-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
