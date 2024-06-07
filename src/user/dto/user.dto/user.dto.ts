import { ApiProperty } from '@nestjs/swagger';

// Assuming Link and LinksDto are imported or defined elsewhere

export class LinkDto {
  @ApiProperty({ example: '/users', description: 'Endpoint URL' })
  href: string;

  @ApiProperty({
    example: 'POST',
    description: 'HTTP method used for the endpoint',
  })
  method: string;

  @ApiProperty({
    example: { href: '/users', method: 'GET' },
    description: 'Self link object containing href and method',
  })
  self: {
    href: string;
    method: string;
  };

  @ApiProperty({
    example: { href: '/users', method: 'POST' },
    description: 'Create link object containing href and method',
  })
  create: {
    href: string;
    method: string;
  };

  constructor(href: string, method: string) {
    this.href = href;
    this.method = method;
  }
}

export class LinksDto {
  @ApiProperty({
    type: () => LinkDto,
    description: 'Link to the current resource',
  })
  self: LinkDto;

  @ApiProperty({
    type: () => LinkDto,
    description: 'Link to the related resource',
  })
  allUsers: LinkDto;

  constructor(links: any) {
    this.self = new LinkDto(links.self.href, links.self.method);
    if (links.allUsers) {
      this.allUsers = new LinkDto(links.allUsers.href, links.allUsers.method);
    }
  }
}

export class UserResponseDataDto {
  @ApiProperty({ example: '66264c066ca92ad8ffdcb670', description: 'User ID' })
  _id: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username: string;

  @ApiProperty({
    example: '$2b$10$FyeLSpWbLTRqi2DobAIJDebmi6kHJAq4rdLF8Ui250DiRgfjWF//y',
    description: 'Hashed password',
  })
  password: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  email: string;

  @ApiProperty({ example: 0, description: 'Status of the user' })
  status: number;

  @ApiProperty({ example: 0, description: 'Role of the user' })
  role: number;

  @ApiProperty({ example: 0, description: 'Version key' })
  __v: number;

  @ApiProperty({
    example: 'User',
    description: 'First name of the user',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    example: '1',
    description: 'Last name of the user',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    example: [],
    description: 'Friends of the user',
    required: false,
    isArray: true,
  })
  friends?: string[];
}

export class UserFetchResponseDto {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: 'Users fetched successfully',
    description: 'Message indicating the result of the operation',
  })
  message: string;

  @ApiProperty({
    type: () => [LinkDto],
    isArray: true,
    description: 'Hypermedia links related to the operation',
  })
  links: LinkDto[];

  @ApiProperty({
    type: () => [UserResponseDataDto, UserResponseDataDto, UserResponseDataDto],
    isArray: true,
    description: 'Data of the fetched users',
  })
  data: [UserResponseDataDto, UserResponseDataDto, UserResponseDataDto];
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
