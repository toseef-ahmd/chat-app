import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      // Use registerAsync instead of register
      imports: [ConfigModule, UserModule], // Import ConfigModule
      useFactory: async (configService: ConfigService) => ({
        // Use useFactory to access ConfigService
        global: true,
        secret: configService.get('JWT_SECRET'), // Access JWT_SECRET using configService
        signOptions: {
          expiresIn: '2h',
        },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
