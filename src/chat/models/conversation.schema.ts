import { SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/authentication/models/user.schema';
import { Message } from './message.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
  // @Prop({ unique: true })
  // username: string;

  @Prop({ type: [Message] })
  messages: Message[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  users: User[];

  @Prop()
  conversationPic: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
