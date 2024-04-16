import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../../user/schemas/user.schema';

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  members?: Array<User>;

  @IsOptional()
  createdBy?: User;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsString()
  @IsOptional()
  description?: string;
}
