import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @ApiProperty({
    description: 'MongoDB ObjectId of the sender',
    example: '507f1f77bcf86cd799439011',
    type: String, // String type because MongoDB ObjectId is represented as a hex string
  })
  @IsMongoId()
  @IsNotEmpty()
  sender: Types.ObjectId; // Assuming sender must be a valid MongoDB ObjectId referring to a User

  @ApiProperty({
    description: 'The actual content of the message',
    example: 'Hello, how are you doing today?',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: string; // The actual message content, must be a non-empty string
}
