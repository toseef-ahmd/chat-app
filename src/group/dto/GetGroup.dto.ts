import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../user/schemas/user.schema';

export class getGroupDto {
  @IsNotEmpty()
  @IsString()
  groupName: string;
  @IsNotEmpty()
  members: User[];
  @IsNotEmpty()
  createdBy: User;
  @IsDateString()
  createdAt: Date;
  @IsString()
  @IsOptional()
  groupDescription?: string;
}
