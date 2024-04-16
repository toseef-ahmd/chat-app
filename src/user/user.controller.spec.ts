import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';

describe('UserController Functions Tests', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn((dto) => ({
      _id: 'unique-id',
      ...dto,
    })),
    findAll: jest.fn(() => [
      { _id: 'unique-id1', email: 'user1@example.com' },
      { _id: 'unique-id2', email: 'user2@example.com' },
    ]),
    findOne: jest.fn((id) => {
      if (id === 'existing-id') {
        return { _id: id, email: 'user@example.com' };
      } else {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    }),
    update: jest.fn((id, dto) => {
      if (id === 'existing-id') {
        return { _id: id, ...dto };
      } else {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }
    }),
    remove: jest.fn((id) => {
      if (id === 'existing-id') {
        return { deletedCount: 1 };
      } else {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('User - Create', () => {
    it('should create a new user', async () => {
      const dto = {
        email: 'test@gmail.com',
        password: 'password',
        username: 'testuser',
      };
      expect(await controller.create(dto)).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: { _id: expect.any(String), ...dto },
      });
      expect(mockUserService.create).toHaveBeenCalledWith(dto);
    });

    it('should throw a not found exception when user already exists', async () => {
      const dto = {
        email: 'test@gmail.com',
        password: 'password',
        username: 'testuser',
      };

      mockUserService.create.mockRejectedValueOnce(
        new Error('User already exists'),
      );

      await expect(controller.create(dto)).rejects.toThrow(
        new NotFoundException('User already exists'),
      );
    });
  });

  describe('User - FindAll', () => {
    it('should fetch all users', async () => {
      expect(await controller.findAll()).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Users fetched successfully',
        data: [
          { _id: 'unique-id1', email: 'user1@example.com' },
          { _id: 'unique-id2', email: 'user2@example.com' },
        ],
      });
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('User - FindOne', () => {
    it('should fetch a single user by ID', async () => {
      const userID = 'existing-id';
      expect(await controller.findOne(userID)).toEqual({
        statusCode: HttpStatus.FOUND,
        message: 'User fetched successfully',
        data: { _id: userID, email: 'user@example.com' },
      });
      expect(mockUserService.findOne).toHaveBeenCalledWith(userID);
    });

    it('should throw a not found exception when user does not exist', async () => {
      const userID = 'non-existing-id';
      await expect(controller.findOne(userID)).rejects.toThrow(
        new NotFoundException(`User with ID ${userID} not found`),
      );
    });
  });

  describe('User - Update', () => {
    it('should update a user', async () => {
      const dto = { email: 'updated@example.com' };
      const userID = 'existing-id';
      expect(await controller.update(userID, dto)).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: { _id: userID, ...dto },
      });
      expect(mockUserService.update).toHaveBeenCalledWith(userID, dto);
    });

    it('should throw a not found exception when trying to Update a non-existing user', async () => {
      const userID = 'non-existing-id';
      await expect(controller.remove(userID)).rejects.toThrow(
        new NotFoundException(`User with ID ${userID} not found`),
      );
    });
  });

  describe('User - Remove', () => {
    it('should delete a user and return success', async () => {
      const userID = 'existing-id';

      const result = await controller.remove(userID);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
        data: null,
      });
      expect(mockUserService.remove).toHaveBeenCalledWith(userID);
    });

    it('should throw a not found exception when trying to delete a non-existing user', async () => {
      const userID = 'non-existing-id';
      await expect(controller.remove(userID)).rejects.toThrow(
        new NotFoundException(`User with ID ${userID} not found`),
      );
    });
  });
});
