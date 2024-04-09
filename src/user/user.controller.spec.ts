import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';

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
    update: jest.fn((id, dto) => ({
      _id: id,
      ...dto,
    })),
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

  it('should create a new user', async () => {
    const dto = {
      email: 'test@gmail.com',
      password: 'password',
      username: 'testuser',
    };
    expect(await controller.create(dto)).toEqual({
      status: 201,
      message: 'User created successfully',
      data: { _id: expect.any(String), ...dto },
    });
    expect(mockUserService.create).toHaveBeenCalledWith(dto);
  });

  it('should fetch all users', async () => {
    expect(await controller.findAll()).toEqual({
      status: 200,
      message: 'Users fetched successfully',
      data: [
        { _id: 'unique-id1', email: 'user1@example.com' },
        { _id: 'unique-id2', email: 'user2@example.com' },
      ],
    });
    expect(mockUserService.findAll).toHaveBeenCalled();
  });

  it('should fetch a single user by ID', async () => {
    const userID = 'existing-id';
    expect(await controller.findOne(userID)).toEqual({
      status: 200,
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

  it('should update a user', async () => {
    const dto = { email: 'updated@example.com' };
    const userID = 'unique-id';
    expect(await controller.update(userID, dto)).toEqual({
      status: 200,
      message: 'User updated successfully',
      data: { _id: userID, ...dto },
    });
    expect(mockUserService.update).toHaveBeenCalledWith(userID, dto);
  });

  it('should delete a user and return success', async () => {
    const userID = 'existing-id';
    expect(await controller.remove(userID)).toEqual({
      status: 200,
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
