import { SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/authentication/models/user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ unique: true })
  content: string;

  @Prop()
  sentAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: User;

  @Prop()
  media: string[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: false,
    default: [],
  })
  readBy: User[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
