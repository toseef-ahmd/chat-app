import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../user/schemas/user.schema';

export class createGroupDto {
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
export class updateteGroupDto {
  @IsNotEmpty()
  @IsString()
  groupName?: string;
  @IsNotEmpty()
  members?: User[];
  @IsNotEmpty()
  createdBy?: User;
  @IsDateString()
  createdAt?: Date;
  @IsString()
  @IsOptional()
  groupDescription?: string;
}