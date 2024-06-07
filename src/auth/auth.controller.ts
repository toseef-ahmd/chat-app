import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { sign } from 'crypto';
import { ApiResponse } from '../interfaces/api-response.interface';
import { LoginDto } from './dto/auth-login.dto/auth-login.dto';
import { SignupDTO } from './dto/auth-signup.dto/auth-signup.dto';
import {
  GetHyperLinks,
  Methods,
  Routes,
} from '../utilities/hypermedia.utility';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ConflictErrorDto } from './dto/auth-signup.dto/conflict-signup.dto';
import { UserCreateResponseDto } from './dto/auth-signup.dto/auth-signup.dto';
import { UnauthorizedErrorDto } from './dto/auth-login.dto/conflict-login.dto';
import { LoginResponseDto } from './dto/auth-login.dto/auth-login.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized error',
    type: UnauthorizedErrorDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<string>> {
    const access_token = await this.authService.login(loginDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
      links: GetHyperLinks(Routes.Auth, Methods.login),
      data: access_token,
    };
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserCreateResponseDto,
  })
  @ApiConflictResponse({
    description: 'Conflict error',
    type: ConflictErrorDto,
  })
  async signup(@Body() signup: SignupDTO): Promise<ApiResponse<string>> {
    const token = await this.authService.signup(signup);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      links: GetHyperLinks(Routes.Auth, Methods.signup),
      data: token,
    };
  }
}
