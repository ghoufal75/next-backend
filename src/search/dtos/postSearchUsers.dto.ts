import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class PostSearchUsers {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumberString()
  phoneNumber: string;
}
