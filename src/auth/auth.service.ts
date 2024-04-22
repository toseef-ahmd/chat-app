import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/auth-login.dto/auth-login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // This method is used to sign up a user
  async signup(signup: CreateUserDto): Promise<string> {
    
    const user = await this.userService.create(signup);

    if (!user) {
      throw new NotFoundException('Failed to create user');
    }

    const payload = { username: user.username, sub: user._id };

    const access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }

  // This method is used to log in a user
  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userService.findUserByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid Email');
    }

    const compare = await bcrypt.compare(loginDto.password, user.password);

    if (!compare) {
      throw new UnauthorizedException('Invalid Password');
    }

    const payload = { username: user.username, sub: user._id };

    const access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }
}
