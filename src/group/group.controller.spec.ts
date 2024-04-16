import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { NotFoundException, HttpStatus } from '@nestjs/common';

describe('GroupController Functions Tests', () => {
  let controller: GroupController;

  const mockGroupService = {
    create: jest.fn((dto) => ({
      _id: 'unique-id',
      ...dto,
    })),
    findAll: jest.fn(() => [
      { _id: 'unique-id1', name: 'Group 1' },
      { _id: 'unique-id2', name: 'Group 2' },
    ]),
    findById: jest.fn((id) => {
      if (id === 'existing-id') {
        return { _id: id, name: 'Existing Group' };
      } else {
        throw new NotFoundException(`Group with ID ${id} not found`);
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
        throw new NotFoundException(`Group with ID ${id} not found`);
      }
    }),
    removeAll: jest.fn(() => ({ deletedCount: 2 })),
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

  it('should create a new group', async () => {
    const dto = { name: 'New Group' };
    expect(await controller.createGroup(dto)).toEqual({
      statusCode: HttpStatus.CREATED,
      message: 'Group created successfully',
      data: { _id: expect.any(String), ...dto },
    });
    expect(mockGroupService.create).toHaveBeenCalledWith(dto);
  });

  it('should fetch all groups', async () => {
    expect(await controller.getGroup()).toEqual({
      statusCode: HttpStatus.OK,
      message: 'Groups fetched successfully',
      data: [
        { _id: 'unique-id1', name: 'Group 1' },
        { _id: 'unique-id2', name: 'Group 2' },
      ],
    });
    expect(mockGroupService.findAll).toHaveBeenCalled();
  });

  it('should fetch a single group by ID', async () => {
    const groupId = 'existing-id';
    expect(await controller.getGroupById(groupId)).toEqual({
      statusCode: HttpStatus.FOUND,
      message: 'Group fetched successfully',
      data: { _id: groupId, name: 'Existing Group' },
    });
    expect(mockGroupService.findById).toHaveBeenCalledWith(groupId);
  });

  it('should update a group', async () => {
    const dto = { name: 'Updated Group' };
    const groupId = 'unique-id';
    expect(await controller.updateGroup(groupId, dto)).toEqual({
      statusCode: HttpStatus.OK,
      message: 'Group updated successfully',
      data: { _id: groupId, ...dto },
    });
    expect(mockGroupService.update).toHaveBeenCalledWith(groupId, dto);
  });

  it('should delete a group and return success', async () => {
    const groupId = 'existing-id';
    expect(await controller.deleteGroup(groupId)).toEqual({
      statusCode: HttpStatus.OK,
      message: 'Group deleted successfully',
      data: null,
    });
    expect(mockGroupService.remove).toHaveBeenCalledWith(groupId);
  });

  it('should delete all groups and return success', async () => {
    expect(await controller.deleteAllGroups()).toEqual({
      statusCode: HttpStatus.OK,
      message: 'All groups deleted successfully',
      data: null,
    });
    expect(mockGroupService.removeAll).toHaveBeenCalled();
  });

  it('should throw a not found exception when no group to delete', async () => {
    mockGroupService.removeAll = jest.fn(() => ({ deletedCount: 0 }));
    await expect(controller.deleteAllGroups()).rejects.toThrow(
      new NotFoundException('No groups found to delete'),
    );
  });

});
