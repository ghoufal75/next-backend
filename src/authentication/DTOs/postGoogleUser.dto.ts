import { IsString } from 'class-validator';
import { IsEmail } from 'class-validator';

export class PostGoogleUser {
  @IsString()
  familyName: string;

  @IsString()
  name: string;

  @IsString()
  givenName: string;

  @IsString()
  imageUrl: string;

  @IsEmail()
  email: string;
}
