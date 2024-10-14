import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { PatchUserDTO } from './dtos/patchUser.dto';
import { AccountManagementService } from './account-management.service';
import { Request } from 'express';
import { JwtGuard } from 'src/authentication/guards/jwt.guard';
@UseGuards(JwtGuard)
@Controller('account-management')
export class AccountManagementController {
  constructor(private accountManagementService: AccountManagementService) {}
  @Patch()
  updateUserData(@Req() req: Request, @Body() dto: PatchUserDTO) {
    return this.accountManagementService.updateUserAccountData(req.user, dto);
  }
}
