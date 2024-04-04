/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { MessageModule } from './message/message.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes ConfigModule global.
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_DB_URL');
        console.log(`Connecting to MongoDB at: ${uri}`); // For debugging, remove in production
        return { uri };
      },
      inject: [ConfigService],
    }),
    ChatModule, // Import ChatModule
    UserModule, // Import UserModule
    GroupModule, // Import GroupModule
    MessageModule, // Import MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      // .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply for all routes
      // Alternatively, apply middleware to specific routes:
      .forRoutes(AppController); // Apply only to AppController routes
    // Or use strings for the controller path
    // .forRoutes('app'); // Apply to routes starting with 'app'
  }
}
