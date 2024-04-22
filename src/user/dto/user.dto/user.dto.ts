import { ApiProperty } from '@nestjs/swagger';

class LinkDto {
  @ApiProperty({ example: '/users', description: 'Endpoint URL' })
  href: string;

  @ApiProperty({
    example: 'POST',
    description: 'HTTP method used for the endpoint',
  })
  method: string;
}

class LinksDto {
  @ApiProperty({
    type: () => LinkDto,
    description: 'Link to the created user resource',
  })
  self: LinkDto;

  @ApiProperty({
    type: () => LinkDto,
    description: 'Link to the list of all users',
  })
  allUsers: LinkDto;
}

export class UserResponseDataDto {
  @ApiProperty({
    example: 'dvemos',
    description: 'Username of the created user',
  })
  username: string;

  // @ApiProperty({
  //   example: '123',
  //   description: 'Password of the created user',
  //   writeOnly: true,
  // })
  // password: string;

  @ApiProperty({
    example: 'adv@gmail.com',
    description: 'Email of the created user',
  })
  email: string;

  @ApiProperty({ example: 0, description: 'Status of the created user' })
  status: number;

  @ApiProperty({ example: 0, description: 'Role of the created user' })
  role: number;

  @ApiProperty({
    example: '6622a428fa7113a2568533da',
    description: 'MongoDB ID of the created user',
  })
  _id: string;

  @ApiProperty({
    example: 0,
    description: 'Version key in MongoDB for the created user',
  })
  __v: number;
}

export class UserCreateResponseDto {
  @ApiProperty({ example: 201, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: 'User created successfully',
    description: 'Message indicating the result of the operation',
  })
  message: string;

  @ApiProperty({
    type: () => [LinksDto],
    isArray: true,
    description: 'Hypermedia links related to the operation',
  })
  links: LinksDto[];

  @ApiProperty({
    type: () => UserResponseDataDto,
    description: 'Data of the created user',
  })
  data: UserResponseDataDto;
}

export class UserUpdateResponseDto {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: 'User Updated successfully',
    description: 'Message indicating the result of the operation',
  })
  message: string;

  @ApiProperty({
    type: () => [LinksDto],
    isArray: true,
    description: 'Hypermedia links related to the operation',
  })
  links: LinksDto[];

  @ApiProperty({
    type: () => UserResponseDataDto,
    description: 'Data of the created user',
  })
  data: UserResponseDataDto;
}
