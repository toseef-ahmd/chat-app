import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { GroupController } from '../src/group/group.controller';
import { GroupService } from '../src/group/group.service';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  InternalServerErrorException,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { CreateGroupDto } from '../src/group/dto/create-group.dto/create-group.dto';
import { AllExceptionsFilter } from '../src/filters/exceptions.filter';

describe('GroupController', () => {
  let app: INestApplication;
  const groupService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [GroupController],
      providers: [{ provide: GroupService, useValue: groupService }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (validationErrors = []) =>
          new BadRequestException({
            statusCode: 400,
            error: 'Bad Request',
            message: validationErrors.flatMap((err) =>
              Object.values(err.constraints).map((message) => message),
            ),
          }),
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('/POST groups (Create Group)', () => {
    it('should create a group successfully', async () => {
      const newGroupData: CreateGroupDto = {
        name: 'testgroup',
        description: 'A test group',
      };

      groupService.create.mockResolvedValueOnce({ ...newGroupData, _id: 1 });

      return await request(app.getHttpServer())
        .post('/group')
        .send(newGroupData)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.data._id).toEqual(1);
          expect(body.data.name).toEqual('testgroup');
          expect(body.data.description).toEqual('A test group');
        });

      // console.log("RSULT: ", result);
    });

    it('should fail to create a group when service fails', async () => {
      const newGroupData: CreateGroupDto = {
        name: 'somegroup',
        description: 'A group that should be created',
      };
      const serviceError = new InternalServerErrorException(
        'Failed to create group',
      );
      groupService.create.mockRejectedValue(serviceError);

      return await request(app.getHttpServer())
        .post('/group')
        .send(newGroupData)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect(({ body }) => {
          expect(body.error).toBe('Internal Server Error');
          expect(body.message[0]).toEqual('Failed to create group');
        });
    });

    it('should return a validation error if name is missing', async () => {
      const incompleteData = { description: 'valid-description' }; // Missing 'name' and 'description'

      const serviceError = new BadRequestException('Failed to create group');
      groupService.create.mockRejectedValue(serviceError);

      await request(app.getHttpServer())
        .post('/group')
        .send(incompleteData)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.error).toBe('Bad Request');
          expect(body.message).toContain('name should not be empty');
          expect(body.message).toContain('name must be a string');
        });
    });

    it('should return a validation error if description is missing', async () => {
      const incompleteData = { name: 'validname' }; // Missing 'name' and 'description'

      const serviceError = new BadRequestException('Failed to create group');
      groupService.create.mockRejectedValue(serviceError);

      await request(app.getHttpServer())
        .post('/group')
        .send(incompleteData)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(({ body }) => {
          expect(body.error).toBe('Bad Request');
          expect(body.message[0]).toContain('Failed to create group');
        });
    });
  });

  // Tests for GET /groups
  describe('/GET groups', () => {
    it('should retrieve all groups successfully', async () => {
      const groups = [
        { _id: 1, name: 'Group One', description: 'First group' },
        { _id: 2, name: 'Group Two', description: 'Second group' },
      ];
      groupService.findAll.mockResolvedValue(groups);

      await request(app.getHttpServer())
        .get('/group')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data.length).toBe(2);
          expect(body.data[0].name).toEqual('Group One');
          expect(body.data[1].name).toEqual('Group Two');
        });
    });

    it('should handle service failure when retrieving all groups', async () => {
      const serviceError = new NotFoundException('No groups found');
      groupService.findAll.mockRejectedValue(serviceError);

      await request(app.getHttpServer())
        .get('/group')
        .expect(HttpStatus.NOT_FOUND)
        .expect(({ body }) => {
          expect(body.error).toBe('Not Found');
          expect(body.message[0]).toBe('No groups found');
        });
    });
  });

  // Tests for GET /groups/:id
  describe('/GET group/:id', () => {
    it('should retrieve a single group by id successfully', async () => {
      const group = {
        _id: 1,
        name: 'Group One',
        description: 'Detailed description',
      };
      groupService.findOne.mockResolvedValueOnce(group);

      await request(app.getHttpServer())
        .get('/group/1')
        .expect(HttpStatus.FOUND)
        .expect(({ body }) => {
          expect(body.data._id).toEqual(1);
          expect(body.data.name).toEqual('Group One');
        });
    });

    it('should handle the case where the group does not exist', async () => {
      groupService.findOne.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/group/999')
        .expect(HttpStatus.NOT_FOUND)
        .expect(({ body }) => {
          expect(body.error).toBe('Not Found');
        });
    });
  });

  // Tests for PUT /groups/:id
  describe('/PUT /groups/:id', () => {
    it('should update a group successfully', async () => {
      const updatedData = {
        name: 'Updated Name',
        description: 'Updated description',
      };
      groupService.update.mockResolvedValueOnce({ _id: '1', ...updatedData });

      await request(app.getHttpServer())
        .put('/group/1') // Correct the endpoint if necessary
        .send(updatedData)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.data.name).toEqual('Updated Name');
          expect(body.data.description).toEqual('Updated description');
        });
    });

    it('should handle the case where the group to update does not exist', async () => {
      groupService.update.mockResolvedValue(null);

      await request(app.getHttpServer())
        .put('/groups/999') // Correct the endpoint if necessary
        .send({ name: 'Irrelevant', description: 'No matter' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  // Tests for DELETE /groups/:id
  describe('/DELETE groups/:id', () => {
    it('should delete a group successfully', async () => {
      groupService.remove.mockResolvedValue({ deletedCount: 1 });

      await request(app.getHttpServer())
        .delete('/group/1')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(HttpStatus.OK);
          expect(body.data).toBe(null);
          expect(body.message).toEqual('Group deleted successfully');
        });
    });

    it('should handle the case where the group to delete does not exist', async () => {
      groupService.remove.mockResolvedValue({ deletedCount: 0 });

      const id = 999;
      await request(app.getHttpServer())
        .delete(`/group/${id}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect(({ body }) => {
          expect(body.statusCode).toBe(HttpStatus.NOT_FOUND);
          expect(body.error).toBe('Not Found');
          expect(body.message[0]).toEqual(`Group with ID ${id} not found`);
        });
    });
  });
});
