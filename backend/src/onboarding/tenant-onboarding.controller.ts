import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SessionUser } from '../common/types/session-user.type';
import { TenantOnboardingService } from './tenant-onboarding.service';
import {
  TenantNinDto,
  TenantEmploymentDto,
  TenantPreferencesDto,
} from './dto/tenant-onboarding.dto';

@ApiTags('onboarding / tenant')
@ApiBearerAuth('bearer')
@Roles('tenant')
@Controller('onboarding/tenant')
export class TenantOnboardingController {
  constructor(private readonly service: TenantOnboardingService) {}

  @Post('nin')
  @ApiOperation({ summary: 'Submit NIN — flips ninStatus to pending' })
  submitNin(@CurrentUser() user: SessionUser, @Body() dto: TenantNinDto) {
    return this.service.submitNin(user.id, dto);
  }

  @Post('employment')
  @ApiOperation({ summary: 'Save employment info and guarantor details' })
  saveEmployment(@CurrentUser() user: SessionUser, @Body() dto: TenantEmploymentDto) {
    return this.service.saveEmployment(user.id, dto);
  }

  @Post('preferences')
  @ApiOperation({ summary: 'Save move-in preferences (budget, areas, bedrooms, timeline)' })
  savePreferences(@CurrentUser() user: SessionUser, @Body() dto: TenantPreferencesDto) {
    return this.service.savePreferences(user.id, dto);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get step-by-step onboarding completion for tenant' })
  getStatus(@CurrentUser() user: SessionUser) {
    return this.service.getStatus(user.id);
  }
}
