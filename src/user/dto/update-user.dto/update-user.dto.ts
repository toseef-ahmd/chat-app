/* eslint-disable prettier/prettier */
// update-user.dto.ts
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserStatus } from 'src/user/schemas/user.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsInt()
  userID?: number;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  username?: string;

  @IsOptional()
  @IsUrl()
  profilePicture?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
