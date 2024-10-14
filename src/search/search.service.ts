import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/authentication/models/user.schema';
import { PostSearchUsers } from './dtos/postSearchUsers.dto';

@Injectable()
export class SearchService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async searchUsers(dto: PostSearchUsers) {
    try {
      if (dto.name) {
        const regex = new RegExp(`^${dto.name}`, 'i');
        return await this.userModel
          .find({ username: regex })
          .select({ _id: 1, fullName: 1, username: 1, profilePic: 1 });
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
}
