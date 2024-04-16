import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let model: any; // Use 'any' to simplify type handling for mocks

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockReturnThis(),
            findOne: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockReturnThis(),
            deleteOne: jest.fn(),
            deleteMany: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get(getModelToken(User.name));

    // Setup mock for exec here if specific to a test
    model.exec.mockResolvedValue(null); // Default to null to be overridden in specific tests
  });

  describe('findUserByEmail', () => {
    it('should return a user when found', async () => {
      const fakeUser = {
        _id: '661dc72b3465f941dcad0376',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      // Setup mock for exec to return fakeUser when called
      model.findOne.mockReturnThis(); // Ensure chaining
      model.exec.mockResolvedValue(fakeUser); // Resolve to fakeUser for this test

      const result = await service.findUserByEmail('test@example.com');
      expect(result).toEqual(fakeUser);
      expect(model.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(model.exec).toHaveBeenCalled(); // Ensure exec was called
    });

    it('should return null when user not found', async () => {
      const result = await service.findUserByEmail('test@example.com');
      expect(result).toBeNull();
      expect(model.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(model.exec).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a user and return the created user', async () => {
      const createUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };
      const expectedUser = {
        _id: '1',
        ...createUserDto,
      };

      model.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(expectedUser);
      expect(model.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw a NotFoundException if creation fails', async () => {
      model.create.mockResolvedValue(null);

      await expect(
        service.create({
          username: 'test',
          email: 'test@example.com',
          password: 'pass',
        }),
      ).rejects.toThrow(new NotFoundException('Failed to create user'));
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          _id: '1',
          username: 'user1',
          email: 'user1@example.com',
          password: 'pass1',
        },
        {
          _id: '2',
          username: 'user2',
          email: 'user2@example.com',
          password: 'pass2',
        },
      ];
      model.find.mockReturnThis(); // Mock chaining
      model.exec.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(model.find).toHaveBeenCalled();
      expect(model.exec).toHaveBeenCalled();
    });

    it('should return an empty array when no users are found', async () => {
      model.find.mockReturnThis(); // Ensure chaining is mocked
      model.exec.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(model.find).toHaveBeenCalled();
      expect(model.exec).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      const user = { _id: '1', username: 'user1', email: 'user1@example.com' };
      model.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(user),
      }));

      const result = await service.findOne('1');
      expect(result).toEqual(user);
    });

    it('should return null if the user is not found', async () => {
      model.findById.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      const result = await service.findOne('unknown-id');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'newuser' }; // Ensure this matches DTO definition
      const updatedUser = {
        _id: '1',
        username: 'newuser',
        email: 'user@example.com',
      };

      model.findByIdAndUpdate.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(updatedUser),
      }));

      const result = await service.update('1', updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should return null if the user to update is not found', async () => {
      const updateUserDto: UpdateUserDto = { username: 'newuser' }; // Consistent use of DTO

      model.findByIdAndUpdate.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      const result = await service.update('unknown-id', updateUserDto);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a user and return a delete result', async () => {
      const deleteResult = { deletedCount: 1 };
      model.deleteOne.mockResolvedValue(deleteResult);

      const result = await service.remove('1');
      expect(result).toEqual(deleteResult);
    });

    it('should throw a NotFoundException if no user is deleted', async () => {
      model.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.remove('unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeAll', () => {
    it('should delete all users and return a delete result', async () => {
      const deleteResult = { deletedCount: 5 };
      model.deleteMany.mockResolvedValue(deleteResult);

      const result = await service.removeAll();
      expect(result).toEqual(deleteResult);
    });

    it('should return a delete result of zero if no users exist', async () => {
      model.deleteMany.mockResolvedValue({ deletedCount: 0 });

      const result = await service.removeAll();
      expect(result).toEqual({ deletedCount: 0 });
    });
  });
});
