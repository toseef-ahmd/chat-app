import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto/create-group.dto';

describe('GroupController Functions Tests', () => {
  let controller: GroupController;

  const mockGroupService = {
    create: jest.fn((dto) => ({
      _id: 'unique-group-id',
      ...dto,
    })),
    findAll: jest.fn(() => [
      { _id: 'unique-group-id1', name: 'Group One' },
      { _id: 'unique-group-id2', name: 'Group Two' },
    ]),
    findOne: jest.fn((id) => {
      if (id === 'existing-id') {
        return { _id: id, name: 'Existing Group' };
      } else {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }
    }),
    update: jest.fn((id, dto) => {
      if (id === 'unique-group-id') {
        return { _id: id, ...dto };
      } else {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }
    }),
    remove: jest.fn((id) => {
      if (id === 'existing-id') {
        return { deletedCount: 1 };
      } else {
        throw new NotFoundException(`Group with ID ${id} not found`);
      }
    }),
    removeAll: jest.fn(() => ({
      deletedCount: 2,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [GroupService],
    })
      .overrideProvider(GroupService)
      .useValue(mockGroupService)
      .compile();

    controller = module.get<GroupController>(GroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Group - Create', () => {
    it('should create a new group', async () => {
      const dto: CreateGroupDto = {
        name: 'New Group',
        description: 'valid-description',
      };

      const result = await controller.create(dto);
      // expect(result).toBe(HttpStatus.CREATED);
      expect(result.statusCode).toEqual(HttpStatus.CREATED);
      expect(result.message).toEqual('Group created successfully');
      expect(result.data).toEqual({ _id: expect.any(String), ...dto });
      expect(result.links).toBeDefined();
      expect(mockGroupService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('Group - FindAll', () => {
    it('should fetch all groups', async () => {
      const result = await controller.findAll();
      // expect(result).toBe(HttpStatus.OK);
      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('Groups fetched successfully');
      expect(result.data).toEqual([
        { _id: 'unique-group-id1', name: 'Group One' },
        { _id: 'unique-group-id2', name: 'Group Two' },
      ]);
      expect(result.links).toBeDefined();
      expect(mockGroupService.findAll).toHaveBeenCalled();
    });

    // it('should return error if no groups were fetch', async () => {
    //   const result = await controller.findAll();
    //   // expect(result).toBe(HttpStatus.OK);
    //   expect(result.statusCode).toEqual(HttpStatus.OK);
    //   expect(result.message).toEqual('Groups fetched successfully');
    //   expect(result.data).toEqual([
    //     { _id: 'unique-group-id1', name: 'Group One' },
    //     { _id: 'unique-group-id2', name: 'Group Two' },
    //   ]);
    //   expect(result.links).toBeDefined();
    //   expect(mockGroupService.findAll).toHaveBeenCalled();
    // });
  });

  describe('Group - FindOne', () => {
    it('should fetch a single group by ID', async () => {
      const groupId = 'existing-id';

      const result = await controller.findOne(groupId);
      // expect(result).toBe(HttpStatus.FOUND);
      expect(result.statusCode).toEqual(HttpStatus.FOUND);
      expect(result.message).toEqual('Group fetched successfully');
      expect(result.data).toEqual({ _id: groupId, name: 'Existing Group' });
      expect(result.links).toBeDefined();
      expect(mockGroupService.findOne).toHaveBeenCalledWith(groupId);
    });

    it('should throw a not found exception when group does not exist', async () => {
      const groupId = 'non-existing-id';
      await expect(controller.findOne(groupId)).rejects.toThrow(
        new NotFoundException(`Group with ID ${groupId} not found`),
      );
    });
  });

  describe('Group - Update', () => {
    it('should update a group', async () => {
      const dto = { name: 'Updated Group' };
      const groupId = 'unique-group-id';
      const result = await controller.update(groupId, dto);

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('Group updated successfully');
      expect(result.data).toEqual({ _id: groupId, name: 'Updated Group' });
      expect(result.links).toBeDefined();
      expect(mockGroupService.update).toHaveBeenCalledWith(groupId, dto);
    });

    it('should throw a not found exception when trying to update a non-existing group', async () => {
      const groupId = 'non-existing-id';
      await expect(controller.update(groupId, {})).rejects.toThrow(
        new NotFoundException(`Group with ID ${groupId} not found`),
      );
    });
  });

  describe('Group - Remove', () => {
    it('should delete a group and return success', async () => {
      const groupId = 'existing-id';

      const result = await controller.remove(groupId);

      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('Group deleted successfully');
      expect(result.data).toBe(null);
      expect(result.links).toBeDefined();
      expect(mockGroupService.remove).toHaveBeenCalledWith(groupId);
    });

    it('should throw a not found exception when trying to delete a non-existing group', async () => {
      const groupId = 'invalid-id';
      await expect(controller.remove(groupId)).rejects.toThrow(
        new NotFoundException(`Group with ID ${groupId} not found`),
      );
    });
  });

  // describe('Group - RemoveAll', () => {
  //   it('should delete all groups and return success', async () => {
  //     expect(await controller.removeAll()).toEqual({
  //       statusCode: HttpStatus.OK,
  //       message: 'All groups deleted successfully',
  //       data: null,
  //     });
  //     expect(mockGroupService.removeAll).toHaveBeenCalled();
  //   });

  //   it('should throw a not found exception when there are no groups to delete', async () => {
  //     mockGroupService.removeAll.mockReturnValueOnce({ deletedCount: 0 });
  //     await expect(controller.removeAll()).rejects.toThrow(
  //       new NotFoundException('No groups found to delete'),
  //     );
  //   });
  // });
});
