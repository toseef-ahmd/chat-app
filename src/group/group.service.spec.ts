import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { getModelToken } from '@nestjs/mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto/update-group.dto';
import { DeleteResult } from 'mongodb';

describe('GroupService', () => {
  let service: GroupService;
  let model: any; // Use 'any' to simplify type handling for mocks

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getModelToken(Group.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockReturnThis(),
            deleteOne: jest.fn().mockReturnThis(),
            deleteMany: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    model = module.get(getModelToken(Group.name));
  });

  describe('create', () => {
    it('should successfully create a group', async () => {
      const createGroupDto: any = { name: 'New Group' };
      const expectedGroup = { _id: '1', ...createGroupDto };

      model.create.mockResolvedValue(expectedGroup);

      const result = await service.create(createGroupDto);
      expect(result).toEqual(expectedGroup);
      expect(model.create).toHaveBeenCalledWith(createGroupDto);
    });

    it('should throw a BadRequestException if creation fails', async () => {
      model.create.mockResolvedValue(null);

      const dto: CreateGroupDto = {
        name: 'name',
        description: '',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      const expectedGroups = [
        { _id: '1', name: 'Group One' },
        { _id: '2', name: 'Group Two' },
      ];
      model.find.mockReturnThis();
      model.exec.mockResolvedValue(expectedGroups);

      const result = await service.findAll();
      expect(result).toEqual(expectedGroups);
      expect(model.find).toHaveBeenCalled();
      expect(model.exec).toHaveBeenCalled();
    });

    it('should return an empty array when no groups are found', async () => {
      model.find.mockReturnThis();
      model.exec.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a group if found', async () => {
      const group = { _id: '1', name: 'Group One' };
      model.findById.mockReturnThis();
      model.exec.mockResolvedValue(group);

      const result = await service.findOne('1');
      expect(result).toEqual(group);
    });

    it('should return null if the group is not found', async () => {
      model.findById.mockReturnThis();
      model.exec.mockResolvedValue(null);

      const result = await service.findOne('unknown-id');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a group and return the updated group', async () => {
      const updateGroupDto: UpdateGroupDto = { name: 'Updated Group' };
      const updatedGroup = { _id: '1', name: 'Updated Group' };

      model.findByIdAndUpdate.mockReturnThis();
      model.exec.mockResolvedValue(updatedGroup);

      const result = await service.update('1', updateGroupDto);
      expect(result).toEqual(updatedGroup);
    });

    it('should return null if the group to update is not found', async () => {
      model.findByIdAndUpdate.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));
      const result = await service.update('unknown-id', { name: 'Any Name' });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a group and return a delete result', async () => {
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
    it('should delete all groups and return a delete result', async () => {
      const deleteResult = { deletedCount: 5 };
      model.deleteMany.mockResolvedValue(deleteResult);

      const result = await service.removeAll();
      expect(result).toEqual(deleteResult);
    });
  });
});
