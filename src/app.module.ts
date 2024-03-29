/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { MessageModule } from './message/message.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { YModule } from './y/y.module';

// const MONGO_DB_HOST = process.env.MONGO_DB_HOST || 'localhost'
// const MONGO_DB_PORT = process.env.MONGO_DB_PORT || '27017'
// const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'nest'
// const MONGO_DB_USER = process.env.MONGO_DB_USER || 'root'
// const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || 'root'

// const MONGO_DB_URI = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}?authSource=admin`
// console.log(MONGO_DB_URI)
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
    MessageModule, YModule, // Import MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
