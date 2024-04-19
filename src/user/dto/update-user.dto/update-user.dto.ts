import { IsEmail, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '../../schemas/user.schema';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    type: 'string',
    format: 'email',
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({
    description: 'Password for the user account',
    example: 'yourStrong(!)Password',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  readonly password?: string;

  @ApiPropertyOptional({
    description: 'First name of the user',
    example: 'John',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the user',
    example: 'Doe',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiPropertyOptional({
    description: 'Username of the user',
    example: 'johndoe',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  readonly username?: string;

  @ApiPropertyOptional({
    description: "URL of the user's profile picture",
    example: 'http://example.com/your-profile-picture.jpg',
    type: 'string',
    format: 'url',
  })
  @IsOptional()
  @IsUrl()
  profilePicture?: string;

  @ApiPropertyOptional({
    description: 'Current status of the user',
    example: UserStatus.Offline,
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
