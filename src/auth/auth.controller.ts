import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { sign } from 'crypto';
import { ApiResponse } from '../interfaces/api-response.interface';
import { LoginDto } from './dto/auth-login/auth-login';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<string>> {
    const access_token  = await this.authService.login(loginDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      data: access_token,
    };
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signup: CreateUserDto) : Promise<ApiResponse<string>> {
    const token = await this.authService.signup(signup);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: token,
    };
  }
}
