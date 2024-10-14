import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { ChatModule } from './chat/chat.module';
import { AccountManagementModule } from './account-management/account-management.module';
import { SearchModule } from './search/search.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [AuthenticationModule,MongooseModule.forRoot('mongodb+srv://syler75:gzChwslSaIBpHBVO@cluster0.ygflqbm.mongodb.net/Next?retryWrites=true&w=majority'), ChatModule, AccountManagementModule, SearchModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
