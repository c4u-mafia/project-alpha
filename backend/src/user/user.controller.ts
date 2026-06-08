import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';

@ApiTags('me')
@ApiBearerAuth('bearer')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user with profile and role data' })
  @ApiOkResponse({ description: 'Current user with profile data' })
  @ApiUnauthorizedResponse({ description: 'No valid session' })
  getMe(@CurrentUser() user: SessionUser) {
    return this.userService.getMe(user.id);
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update profile fields (phone, DOB, gender, city)' })
  @ApiOkResponse({ description: 'Updated profile' })
  updateProfile(@CurrentUser() user: SessionUser, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(user.id, dto);
  }

  @Get('me/onboarding-status')
  @ApiOperation({ summary: 'Get step-by-step onboarding completion status' })
  @ApiOkResponse({ description: 'Onboarding completion flags per step' })
  getOnboardingStatus(@CurrentUser() user: SessionUser) {
    return this.userService.getOnboardingStatus(user.id);
  }
}
