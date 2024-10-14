import { SchemaFactory } from '@nestjs/mongoose';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { HydratedDocument } from 'mongoose';
import { Gender } from './gender.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop()
  fullName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  birthDate: Date;

  @Prop({ type: String, enum: Gender })
  gender: Gender;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop([String])
  imageUrls: string[];

  @Prop()
  profilePic: string;

  @Prop({ default: 'local' })
  provider: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
