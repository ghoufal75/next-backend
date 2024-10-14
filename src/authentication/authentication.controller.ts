import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Body, Param } from '@nestjs/common/decorators';
import { Request } from 'express';
import { AuthenticationService } from './authentication.service';
import { PostGoogleUser } from './DTOs/postGoogleUser.dto';
import { PostFacebookUser } from './DTOs/postFacebookUser.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('google')
  signWithGoogle(@Body() data: PostGoogleUser) {
    return this.authService.signWithGoogle(data);
  }

  @Post('facebook')
  signWithFacebook(@Body() data: PostFacebookUser) {
    return this.authService.signWithFacebook(data);
  }
}
