// src/auth/auth.module.ts or the relevant module where JwtStrategy is used
import { Module } from '@nestjs/common';
import { JwtStrategy } from '../middlewares/auth/auth.middleware';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), ConfigModule],
  providers: [JwtStrategy, AuthService],
  exports: [PassportModule, JwtStrategy],
  controllers: [AuthController], // Exporting JwtStrategy if it's used outside this module
})
export class AuthModule {}
