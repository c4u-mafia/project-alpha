import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';

@ApiTags('me')
@ApiBearerAuth('bearer')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user',
    description:
      'Returns the authenticated user with their profile and role-specific data (tenant or landlord profile).',
  })
  @ApiOkResponse({ description: 'Current user with profile data' })
  @ApiUnauthorizedResponse({ description: 'No valid session' })
  getMe(@CurrentUser() user: SessionUser) {
    return this.userService.getMe(user.id);
  }
}
