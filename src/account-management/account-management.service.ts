import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/authentication/models/user.schema';
import { PatchUserDTO } from './dtos/patchUser.dto';
import mongoose from 'mongoose';

@Injectable()
export class AccountManagementService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async updateUserAccountData(user: any, dto: PatchUserDTO) {
    console.log('Here is the dto : ', dto);
    try {
      await this.userModel.findOneAndUpdate(
        new mongoose.Types.ObjectId(user.userId),
        { $set: { ...dto } },
      );
      return { msg: 'Data succesfully updated.' };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }
  }
}
