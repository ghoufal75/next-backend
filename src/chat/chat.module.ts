import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './models/conversation.schema';
import { Message, MessageSchema } from './models/message.schema';

@Module({
  imports: [
    AuthenticationModule,
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [
    ChatService,
    ChatGateway,
    // {
    //   provide: 'SOCKET_IO_SERVER',
    //   useFactory: (chatGateway: ChatGateway) => chatGateway.server,
    //   inject: [ChatGateway],
    // },
  ],
  controllers: [ChatController],
  // exports: ['SOCKET_IO_SERVER'],
})
export class ChatModule {}
