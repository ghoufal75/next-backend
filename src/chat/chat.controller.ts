import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/authentication/guards/jwt.guard';
import { PostConversationDTO } from './DTOs/postConversation.dto';
import { ChatService } from './chat.service';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  helloChat() {
    return 'Hello Chat';
  }

  @Post('/conversation')
  postConversation(@Req() req: Request, @Body() dto: PostConversationDTO) {
    return this.chatService.createConversation(req.user,dto);
  }

  @Delete('/conversation/:id')
  deleteConversation(@Param('id') id: any) {
    return this.chatService.deleteConversation(id);
  }

  @Get('conversation')
  getConversations(@Req() req: Request) {
    console.log('Request received');
    const user = req?.user;
    return this.chatService.getConversations(user);
  }
}
