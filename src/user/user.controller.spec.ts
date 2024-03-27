import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

const mockUser = {
  _id: 'a1b2c3d4e5f6',
  name: 'John Doe',
  email: 'john@example.com',
  // Include any other properties that are relevant to your User model
};

describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<UserDocument>;

  const mockUserModel = {
    new: jest.fn().mockResolvedValue(mockUser),
    constructor: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userModel).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = { name: 'John Doe', email: 'john@example.com' };
      mockUserModel.save.mockResolvedValue(createUserDto);

      const result = await userService.createUser(createUserDto);

      expect(result).toEqual(createUserDto);
      expect(mockUserModel.save).toHaveBeenCalled();
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      mockUserModel.find.mockResolvedValue([]);
      const result = await userService.findAllUsers();
      expect(result).toEqual([]);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  describe('findOneUser', () => {
    it('should return a single user', async () => {
      const userID = 'some-user-id';
      mockUserModel.findOne.mockResolvedValue({ userID });

      const result = await userService.findOneUser(userID);

      expect(result).toEqual({ userID });
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ userID });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userID = 'some-user-id';
      const updateUserDto = { name: 'Jane Doe' };
      mockUserModel.findOneAndUpdate.mockResolvedValue(updateUserDto);

      const result = await userService.updateUser(userID, updateUserDto);

      expect(result).toEqual(updateUserDto);
      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userID },
        updateUserDto,
        { new: true },
      );
    });
  });

  describe('removeUser', () => {
    it('should remove the user', async () => {
      const userID = 'some-user-id';
      mockUserModel.deleteOne.mockResolvedValue(true);

      const result = await userService.removeUser(userID);

      expect(result).toBeTruthy();
      expect(mockUserModel.deleteOne).toHaveBeenCalledWith({ userID });
    });
  });
});
