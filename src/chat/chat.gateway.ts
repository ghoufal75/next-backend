import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { ChatService } from './chat.service';
import { Socket } from 'socket.io';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

@WebSocketGateway({ cors: true })
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => ChatService)) private chatService,
    private authService: AuthenticationService,
  ) {}

  @WebSocketServer()
  public server: any;

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    payload = JSON.parse(payload);
    // console.log('Rooms : ', this.chatService.rooms);
    const conv = payload.conversation;
    payload.sentAt = new Date();
    payload.readBy = [];
    let room = this.chatService.rooms.find(el=>el.roomId==conv);
    console.log("Here are conencted users : ",this.chatService.connectedUsers);
    console.log("Here are rooms : ",this.chatService.rooms);
    for (let user of room.users){
      if(!room.joined.find(us=>us.userId==user) && this.chatService.connectedUsers.find(el=>el._id==user)){
        console.log("Here is user from joined : ",room.joined[0])
        console.log(`User ${user} isn't connected`)
        this.chatService.connectedUsers.find(el=>el._id==user).socket.join(conv);
        this.server.to( this.chatService.connectedUsers.find(el=>el._id==user).socketId).emit('getNewConv');
      }
    }
    this.server.to(conv).emit('newMessage', JSON.stringify(payload));
    const result = await this.chatService.saveMessage(payload);
    console.log("Here is the saving result : ",result)
    if (Object.keys(result)[0] == 'error') {
      client.emit('savedError', JSON.stringify(result));
    } else {
      client.emit('savedSuccess', JSON.stringify(result));
    }
    console.log('Convs : ', conv);
  }

  @SubscribeMessage('seen')
  async handleSeenStatus(client: any, payload: any) {
    payload = JSON.parse(payload);
    this.server.to(payload.conversation).emit('messageRead',JSON.stringify(payload));
    let read = await this.chatService.seeMessage(client,payload);
  }

  @SubscribeMessage('isWriting')
  handleIsWriting(client : any,payload){
    payload = JSON.parse(payload);
    this.server.to(payload.conversation).emit('isWriting',JSON.stringify(payload));
  }

  handleConnection(client: Socket, ...args: any[]) {
    // const token: string = client.handshake.query.token as string;
    // const decoded: { [key: string]: string } = this.authService.verify(token);
    // if (decoded) {
    //   this.chatService.connectUser(client, decoded.sub);
    // }
    // console.log('Socket established');
    // client.send('info');
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, data: any) {
    data = JSON.parse(data);
    const token: string = data.token as string;
    console.log("Here is the token : ",token);  
    const decoded: { [key: string]: string } = this.authService.verify(token);
    if (decoded) {
      this.chatService.connectUser(client, decoded.sub);
    }
    client.send('Successfully joined');
  }

  handleDisconnect(client: any) {
    this.chatService.disconnectUser(client);
  }
}
