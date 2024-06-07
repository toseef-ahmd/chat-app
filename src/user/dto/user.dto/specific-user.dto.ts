import { ApiProperty } from '@nestjs/swagger';

class SelfLinkDto {
  @ApiProperty({
    example: '/users/{id}',
    description: 'The URL of the self link',
  })
  href: string;

  @ApiProperty({
    example: 'GET',
    description: 'The HTTP method of the self link',
  })
  method: string;
}

class UpdateLinkDto {
  @ApiProperty({
    example: '/users/{id}',
    description: 'The URL of the update link',
  })
  href: string;

  @ApiProperty({
    example: 'PUT',
    description: 'The HTTP method of the update link',
  })
  method: string;
}

class DeleteLinkDto {
  @ApiProperty({
    example: '/users/{id}',
    description: 'The URL of the delete link',
  })
  href: string;

  @ApiProperty({
    example: 'DELETE',
    description: 'The HTTP method of the delete link',
  })
  method: string;
}

class LinkDto {
  @ApiProperty({ type: () => SelfLinkDto, description: 'Self link details' })
  self: SelfLinkDto;

  @ApiProperty({
    type: () => UpdateLinkDto,
    description: 'Update link details',
  })
  update: UpdateLinkDto;

  @ApiProperty({
    type: () => DeleteLinkDto,
    description: 'Delete link details',
  })
  delete: DeleteLinkDto;
}

class UserResponseDataDto {
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

  @ApiProperty({ example: 'User', description: 'First name of the user' })
  firstName: string;

  @ApiProperty({ example: '1', description: 'Last name of the user' })
  lastName: string;
}

export class FetchUserFoundResponse {
  @ApiProperty({ example: 302, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: 'User fetched successfully',
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
    type: () => UserResponseDataDto,
    description: 'Data of the fetched user',
  })
  data: UserResponseDataDto;
}
