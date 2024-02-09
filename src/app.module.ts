import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';}
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { MessageModule } from './message/message.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'),
  ConfigModule.forRoot({
    isGlobal: true, // This makes the config globally available
  }),],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
