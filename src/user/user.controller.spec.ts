import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn((dto) => {
      return {
        _id: 'unique-id',
        ...dto,
      };
    }),
    update: jest.fn((id, dto) => {
      return {
        _id: id,
        ...dto,
      };
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

  it('Should Create a new User', () => {
    const dto = {
      email: 'test@gmail.com',
      password: 'password',
      name: 'testuser',
    };

    expect(controller.create(dto)).toEqual({
      _id: expect.any(String),
      email: 'test@gmail.com',
      password: 'password',
      name: 'testuser',
    });

    expect(mockUserService.create).toHaveBeenCalledWith(dto);
  });

  it('Should Update a User', () => {
    const dto = {
      email: 'xyz@gmail.com',
    };

    expect(controller.update('unique-id', dto)).toEqual({
      _id: 'unique-id',
      ...dto,
    });

    expect(mockUserService.update).toHaveBeenCalled();
  });
});
