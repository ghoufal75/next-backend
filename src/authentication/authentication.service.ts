import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostGoogleUser } from './DTOs/postGoogleUser.dto';
import { User } from './models/user.schema';
import { PostFacebookUser } from './DTOs/postFacebookUser.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  verify(token) {
    return this.jwtService.verify(token);
  }

  async signWithGoogle(data: PostGoogleUser) {
    let res;
    let payload;
    let jwt;
    let firstConnection = false;
    try {
      let user = await this.userModel.findOne({
        email: data.email,
      });
      let fullName = '';
      if (!user) {
        fullName = data.familyName + ' ' + data.givenName;
        user = new this.userModel({
          username: data.name,
          fullName,
          profilePic:
            'https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png',
          email: data.email,
          provider: 'google',
        });
        res = await user.save();
        payload = { sub: res._id };
        firstConnection = true;
        console.log('Here is response : ', res);
      } else {
        payload = { sub: user._id };
        fullName = user.fullName;
      }
      jwt = await this.jwtService.signAsync(payload);
      return {
        _id: user._id ?? res._id,
        access_token: jwt,
        profilePic: user.profilePic ?? res.profilePic,
        username : user.username ?? res.username,
        expiresIn: 3600,
        fullName,
        firstConnection,
      };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async signWithFacebook(data: PostFacebookUser) {
    let res;
    let payload;
    let jwt;
    let firstConnection = false;
    try {
      let user = await this.userModel.findOne({
        email: data.email,
      });
      let fullName = '';
      if (!user) {
        fullName = data.last_name + ' ' + data.first_name;
        user = new this.userModel({
          username: data.name,
          fullName,
          profilePic:
            'https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png',
          email: data.email,
          provider: 'facebook',
        });
        res = await user.save();
        payload = { sub: res._id };
        firstConnection = true;
      } else {
        payload = { sub: user._id };
        fullName = user.fullName;
      }
      jwt = await this.jwtService.signAsync(payload);
      return {
        profilePic: user.profilePic ?? res.profilePic,
        username : user.username ?? res.username,
        access_token: jwt,
        expiresIn: 3600,
        fullName,
        firstConnection,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
}
