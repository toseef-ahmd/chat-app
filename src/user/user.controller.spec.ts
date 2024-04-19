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
        throw new NotFoundException(`User with ID ${id} not found`);
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

  describe('create', () => {
    it('should successfully create a user', async () => {
      const dto = {
        email: 'test@gmail.com',
        password: 'password',
        username: 'testuser',
      };
      mockUserService.create.mockResolvedValue({
        _id: 'unique-id',
        ...dto,
      });

      const result = await controller.create(dto);
      
      expect(mockUserService.create).toHaveBeenCalledWith(dto);
      expect(result.statusCode).toEqual(HttpStatus.CREATED);
      expect(result.message).toEqual('User created successfully');
      expect(result.data).toEqual({
        _id: 'unique-id',
        ...dto,
      });
      expect(result.links).toBeDefined();
    });

    it('should throw NotFoundException when user already exists', async () => {
      const dto = {
        email: 'test@gmail.com',
        password: 'password',
        username: 'testuser',
      };
      mockUserService.create.mockRejectedValueOnce(
        new NotFoundException('User already exists'),
      );

      await expect(controller.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const usersArray = [
        { _id: 'unique-id1', email: 'user1@example.com' },
        { _id: 'unique-id2', email: 'user2@example.com' },
      ];
      // mockUserService.findAll.mockResolvedValueOnce(usersArray as never);

      const result = await controller.findAll();

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('Users fetched successfully');
      expect(result.data).toEqual(usersArray);
      expect(result.links).toBeDefined();
      expect(mockUserService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no users are found', async () => {
      mockUserService.findAll.mockResolvedValueOnce([] as never);

      const result = await controller.findAll();

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('No users were found');
      expect(result.data).toEqual([]);
      expect(result.links).toBeDefined();

    });
  });

  describe('findOne', () => {
    it('should fetch a single user by ID', async () => {
      const userID = 'existing-id';

      const result = await controller.findOne(userID);

      expect(result.statusCode).toEqual(HttpStatus.FOUND);
      expect(result.message).toEqual('User fetched successfully');
      expect(result.data).toEqual({
        _id: userID,
        email: 'user@example.com',
      });
      expect(result.links).toBeDefined();

      expect(mockUserService.findOne).toHaveBeenCalledWith(userID);
    });

    it('should throw a NotFoundException when user does not exist', async () => {
      const userID = 'non-existing-id';
      await expect(controller.findOne(userID)).rejects.toThrow(
        new NotFoundException(`User with ID ${userID} not found`),
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userID = 'existing-id';
      const dto = { email: 'updated@example.com' };

      const result = await controller.update(userID, dto);
      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('User updated successfully');
      expect(result.data).toEqual({ _id: userID, ...dto });
      expect(result.links).toBeDefined();

      expect(mockUserService.update).toHaveBeenCalledWith(userID, dto);
    });

    it('should throw a NotFoundException when trying to update a non-existing user', async () => {
      const userID = 'non-existing-id';
      await expect(controller.update(userID, {})).rejects.toThrow(
        new NotFoundException(`User with ID ${userID} not found`),
      );
    });
  });

  describe('remove', () => {
    it('should delete a user and return success', async () => {
      const userID = 'existing-id';

      const result = await controller.remove(userID);

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('User deleted successfully');
      expect(result.data).toBe(null);
      expect(result.links).toBeDefined();

      expect(mockUserService.remove).toHaveBeenCalledWith(userID);
    });

    it('should throw a NotFoundException when trying to delete a non-existing user', async () => {
      const userID = 'non-existing-id';
      await expect(controller.remove(userID)).rejects.toThrow(
        new NotFoundException(`User with ID ${userID} not found`),
      );
    });
  });
});
