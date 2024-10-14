import { IsString } from 'class-validator';
import { IsEmail } from 'class-validator';

export class PostFacebookUser {
  @IsString()
  name: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  id: number;

  @IsEmail()
  email: string;
}
