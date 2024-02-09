import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [UsersModule, ChatModule, UserModule, GroupModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
