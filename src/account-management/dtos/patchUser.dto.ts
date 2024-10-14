import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Gender } from 'src/authentication/models/gender.enum';

export class PatchUserDTO {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsNumberString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  gender: Gender;


  @IsString()
  @IsOptional()
  profilePic: string;
}
