import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationDocument,
} from './models/conversation.schema';
import mongoose, { Model } from 'mongoose';
import { Message, MessageDocument } from './models/message.schema';
import { PostConversationDTO } from './DTOs/postConversation.dto';
import { Room } from './models/room.model';

import { ChatGateway } from './chat.gateway';



@Injectable()
export class ChatService {
  rooms: Room[] = [];
  connectedUsers = [];


  constructor(
    @Inject(forwardRef(() => ChatGateway)) private chatGateway,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  connectUser(socket, userId) {
    this.connectedUsers.push({_id : userId,socketId: socket.id,socket});
    for (const room of this.rooms) {
      if (room.users.includes(userId)) {
        if(room.joined.findIndex((el:any)=>el==userId)==-1){
          console.log("Here is joined array : ",room.joined);
          console.log("Here is joined id : ",userId);
          socket.join(room.roomId);
          room.joined.push({userId,socketId : socket.id});
        }
      }
    }
  }

  async getConversations(user) {
    try {
      const convs = await this.conversationModel
        .find({
          users: { $in: [user.userId] },
        })
        .populate('users');
      console.log('Here are convs : ', convs);
      for (const conv of convs) {
        if (
          this.rooms.findIndex((el) => el.roomId == conv._id.toString()) == -1
        ) {
          this.rooms.push({
            roomId: conv._id.toString(),
            users: conv.users.map((el: any) => el.id),
            joined: [],
          });
        }
      }
      return convs;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }


  async disconnectUser(socket){
    for(let el of this.rooms){
      let connectedUserIndex = el.joined.findIndex(el=>el.socketId==socket.id)
      if(connectedUserIndex != -1){
        socket.leave(el.roomId);
        el.joined.splice(connectedUserIndex,1);
      }
    }
  }

  async seeMessage(client,payload){
    try{
      console.log("[Payload] : ",payload);
      const result = [];
      for await(let msg of payload.messages){
        let res = await this.conversationModel.updateOne({
          _id : new mongoose.Types.ObjectId(payload.conversation),
          'messages.sentAt': msg
        },{
          $push : {'messages.$.readBy' : new mongoose.Types.ObjectId(payload.reader)}
        });
        result.push(res);
      }
      console.log("[Result of update] : ",result);
      return;
    }
    catch(err){
      console.log(err);
      return {error : 'Error while reading messages.'}
    }
  }

  async saveMessage(payload: any) {
    try {
      await this.conversationModel.findByIdAndUpdate(
        new mongoose.Types.ObjectId(payload.conversation),
        {
          $push: {
            messages: {
              sender: new mongoose.Types.ObjectId(payload.sender),
              sentAt: payload.sentAt,
              media: null,
              content: payload.content,
            },
          },
        },
      );
      return { msg: 'Message succesfully saved' };
    } catch (err) {
      console.log(err);
      return { error: { sentAt: payload.sentAt, content: payload.content } };
    }
  }

  

  async createConversation(user: any, dto: PostConversationDTO) {
    try {
      console.log('Here is the user id : ', user.userId);
      console.log('Here are the conv users : ', dto.users);
      const existingConv = await this.conversationModel.findOne({
        users : {$size : dto.users.length+1 ,$all : [  ...dto.users.map((el) => new mongoose.Types.ObjectId(el)),
          new mongoose.Types.ObjectId(user.userId),]}
      ,})
      console.log(existingConv);
      if(existingConv){
        throw new ConflictException('Conversation already exists');
      }
      const res = await new this.conversationModel({
        users: [
          ...dto.users.map((el) => new mongoose.Types.ObjectId(el)),
          new mongoose.Types.ObjectId(user.userId),
        ],
        messages: [],
        conversationPic:
          'https://static.vecteezy.com/system/resources/previews/036/280/654/original/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg',
      }).save();
      return { msg: 'Conversation was succesfully created' };
    } catch (err) {
      console.log(err);
      if(err instanceof ConflictException){
        throw  err;
      }
      throw new InternalServerErrorException(err);
    }
  }

  async deleteConversation(id: any) {
    try {
      await this.conversationModel.findByIdAndDelete(
        new mongoose.Types.ObjectId(id),
      );
      return { msg: 'Conversation was successfully deleted' };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }


}
